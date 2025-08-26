#!/bin/bash

# Monitor de Performance - ZASA Kitchen Studio
# Verificar el estado y rendimiento del sistema de optimización

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_URL="https://www.zasakitchenstudio.mx"
BACKUP_DIR="$SCRIPT_DIR/img-backups"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 ZASA Kitchen Studio - Monitor de Performance${NC}"
echo -e "${BLUE}===============================================${NC}"

# 1. Verificar estado del sitio
echo -e "${YELLOW}📡 Verificando conectividad del sitio...${NC}"
if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Sitio web accesible${NC}"
    
    # Verificar tiempo de respuesta
    response_time=$(curl -o /dev/null -s -w '%{time_total}\n' "$SITE_URL")
    echo "   ⏱️  Tiempo de respuesta: ${response_time}s"
    
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        echo -e "${GREEN}   🚀 Tiempo excelente (<1s)${NC}"
    elif (( $(echo "$response_time < 2.0" | bc -l) )); then
        echo -e "${YELLOW}   ⚡ Tiempo bueno (<2s)${NC}"
    else
        echo -e "${RED}   ⚠️  Tiempo mejorable (>2s)${NC}"
    fi
else
    echo -e "${RED}❌ Sitio web no accesible${NC}"
fi

echo

# 2. Análisis de tamaño del proyecto
echo -e "${YELLOW}📊 Análisis de tamaño del proyecto...${NC}"
total_size=$(du -sm "$SCRIPT_DIR" | cut -f1)
img_size=$(du -sm "$SCRIPT_DIR/img" 2>/dev/null | cut -f1 || echo "0")

echo "   📁 Tamaño total: ${total_size}MB"
echo "   🖼️  Tamaño imágenes: ${img_size}MB"
echo "   📈 Porcentaje imágenes: $((img_size * 100 / total_size))%"

if [ "$total_size" -lt 700 ]; then
    echo -e "${GREEN}   ✅ Proyecto optimizado${NC}"
elif [ "$total_size" -lt 900 ]; then
    echo -e "${YELLOW}   ⚡ Proyecto en buen estado${NC}"
else
    echo -e "${RED}   ⚠️  Proyecto necesita optimización${NC}"
fi

echo

# 3. Verificar imágenes sin optimizar
echo -e "${YELLOW}🔍 Buscando imágenes sin optimizar...${NC}"
unoptimized=0
large_images=""

while IFS= read -r -d '' file; do
    size=$(stat -f%z "$file" 2>/dev/null || echo "0")
    if [ "$size" -gt 1048576 ]; then # > 1MB
        ((unoptimized++))
        filename=$(basename "$file")
        size_mb=$((size / 1024 / 1024))
        large_images+="   📸 $filename (${size_mb}MB)\n"
    fi
done < <(find "$SCRIPT_DIR/img" \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -type f -print0 2>/dev/null)

if [ "$unoptimized" -eq 0 ]; then
    echo -e "${GREEN}   ✅ Todas las imágenes optimizadas${NC}"
else
    echo -e "${YELLOW}   ⚠️  $unoptimized imágenes grandes encontradas:${NC}"
    echo -e "$large_images"
    echo -e "${BLUE}   💡 Ejecuta: ./optimize-new-images.sh${NC}"
fi

echo

# 4. Verificar WebP disponibles
echo -e "${YELLOW}🌐 Verificando soporte WebP...${NC}"
webp_count=$(find "$SCRIPT_DIR/img" -name "*.webp" -type f 2>/dev/null | wc -l | tr -d ' ')
jpg_count=$(find "$SCRIPT_DIR/img" \( -name "*.jpg" -o -name "*.jpeg" \) -type f 2>/dev/null | wc -l | tr -d ' ')

echo "   📊 Imágenes WebP: $webp_count"
echo "   📊 Imágenes JPG/JPEG: $jpg_count"

if [ "$webp_count" -gt 0 ]; then
    webp_percentage=$((webp_count * 100 / (jpg_count + 1)))
    echo "   📈 Cobertura WebP: ${webp_percentage}%"
    
    if [ "$webp_percentage" -gt 50 ]; then
        echo -e "${GREEN}   ✅ Buena cobertura WebP${NC}"
    else
        echo -e "${YELLOW}   ⚡ Cobertura WebP mejorable${NC}"
    fi
else
    echo -e "${YELLOW}   ℹ️  No hay imágenes WebP (normal en este sistema)${NC}"
fi

echo

# 5. Verificar backups
echo -e "${YELLOW}🔄 Verificando sistema de backups...${NC}"
if [ -d "$BACKUP_DIR" ]; then
    backup_count=$(find "$BACKUP_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
    backup_size=$(du -sm "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")
    
    echo "   📁 Backups disponibles: $backup_count archivos"
    echo "   💾 Tamaño backups: ${backup_size}MB"
    
    if [ "$backup_count" -gt 0 ]; then
        echo -e "${GREEN}   ✅ Sistema de backup activo${NC}"
    else
        echo -e "${YELLOW}   ℹ️  No hay backups (ejecuta optimize-new-images.sh)${NC}"
    fi
else
    echo -e "${YELLOW}   ℹ️  Directorio de backup no existe${NC}"
fi

echo

# 6. Verificar archivos de optimización
echo -e "${YELLOW}🛠️  Verificando archivos del sistema...${NC}"
files_check=(
    "optimize-new-images.sh:Script de optimización"
    "webp-support.js:Sistema WebP"
    "_headers:Headers CDN"
    "OPTIMIZACION.md:Documentación"
)

for file_info in "${files_check[@]}"; do
    file="${file_info%%:*}"
    desc="${file_info##*:}"
    
    if [ -f "$SCRIPT_DIR/$file" ]; then
        echo -e "${GREEN}   ✅ $desc${NC}"
    else
        echo -e "${RED}   ❌ $desc (falta $file)${NC}"
    fi
done

echo

# 7. Test de headers HTTP
echo -e "${YELLOW}🌐 Verificando headers HTTP...${NC}"
if command -v curl >/dev/null 2>&1; then
    # Verificar headers críticos
    headers_response=$(curl -s -I "$SITE_URL" || echo "ERROR")
    
    if echo "$headers_response" | grep -q "x-frame-options"; then
        echo -e "${GREEN}   ✅ Headers de seguridad presentes${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Algunos headers de seguridad faltantes${NC}"
    fi
    
    if echo "$headers_response" | grep -q "cache-control"; then
        echo -e "${GREEN}   ✅ Cache-Control configurado${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Cache-Control no detectado${NC}"
    fi
else
    echo -e "${YELLOW}   ℹ️  curl no disponible, saltando test de headers${NC}"
fi

echo

# 8. Resumen y recomendaciones
echo -e "${BLUE}📋 Resumen y Recomendaciones${NC}"
echo -e "${BLUE}=============================${NC}"

if [ "$total_size" -lt 700 ] && [ "$unoptimized" -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Excelente! El sitio está completamente optimizado${NC}"
    echo -e "${GREEN}   Rendimiento: Óptimo${NC}"
    echo -e "${GREEN}   Tamaño: Controlado${NC}"
    echo -e "${GREEN}   Imágenes: Optimizadas${NC}"
elif [ "$total_size" -lt 900 ] && [ "$unoptimized" -lt 5 ]; then
    echo -e "${YELLOW}⚡ Buen estado general, pocas mejoras pendientes${NC}"
    if [ "$unoptimized" -gt 0 ]; then
        echo -e "${BLUE}   🔧 Acción recomendada: ./optimize-new-images.sh${NC}"
    fi
else
    echo -e "${RED}⚠️  Se requiere optimización${NC}"
    echo -e "${BLUE}   🔧 Acciones recomendadas:${NC}"
    echo -e "${BLUE}      1. ./optimize-new-images.sh${NC}"
    echo -e "${BLUE}      2. Revisar imágenes grandes${NC}"
    echo -e "${BLUE}      3. Considerar eliminación de duplicados${NC}"
fi

echo
echo -e "${BLUE}💡 Para más información consulta: OPTIMIZACION.md${NC}"

# Crear reporte en archivo
report_file="performance-report-$(date +%Y%m%d).txt"
{
    echo "ZASA Kitchen Studio - Reporte de Performance"
    echo "=============================================="
    echo "Fecha: $(date)"
    echo "Tamaño total: ${total_size}MB"
    echo "Tamaño imágenes: ${img_size}MB"
    echo "Imágenes sin optimizar: $unoptimized"
    echo "Tiempo de respuesta: ${response_time:-N/A}s"
    echo "WebP disponibles: $webp_count"
} > "$report_file"

echo -e "${GREEN}📝 Reporte guardado en: $report_file${NC}"