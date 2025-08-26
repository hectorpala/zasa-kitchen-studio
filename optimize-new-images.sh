#!/bin/bash

# Script de optimización automática de imágenes para ZASA Kitchen Studio
# Uso: ./optimize-new-images.sh [directorio]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$SCRIPT_DIR/img}"
QUALITY=70
MAX_SIZE=1200
BACKUP_DIR="$SCRIPT_DIR/img-backups"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ZASA Kitchen Studio - Optimizador de Imágenes${NC}"
echo -e "${BLUE}================================================${NC}"

# Crear directorio de backup si no existe
mkdir -p "$BACKUP_DIR"

# Función para optimizar imagen
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    local name="${filename%.*}"
    local size_before=$(stat -f%z "$file" 2>/dev/null || echo "0")
    
    echo -e "${YELLOW}📸 Procesando: $filename${NC}"
    
    # Crear backup si no existe
    if [[ ! -f "$BACKUP_DIR/$filename" ]]; then
        cp "$file" "$BACKUP_DIR/$filename"
        echo "   ✅ Backup creado"
    fi
    
    # Optimizar según tipo de archivo
    extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    case "$extension_lower" in
        jpg|jpeg)
            sips -s formatOptions "$QUALITY" -Z "$MAX_SIZE" "$file" > /dev/null 2>&1
            ;;
        png)
            # Convertir PNG grandes a JPG para mejor compresión
            if [[ $size_before -gt 500000 ]]; then # > 500KB
                local new_file="${file%.*}.jpg"
                echo "   🔄 Convirtiendo PNG grande a JPG..."
                sips -s format jpeg -s formatOptions "$QUALITY" -Z "$MAX_SIZE" "$file" --out "$new_file" > /dev/null 2>&1
                rm "$file"
                file="$new_file"
                filename=$(basename "$file")
            else
                # Optimizar PNG pequeño
                sips -Z "$MAX_SIZE" "$file" > /dev/null 2>&1
            fi
            ;;
        webp)
            echo "   ⚠️  WebP ya optimizado, saltando..."
            return 0
            ;;
        *)
            echo "   ⚠️  Formato no soportado: $extension"
            return 0
            ;;
    esac
    
    # Calcular ahorro
    local size_after=$(stat -f%z "$file" 2>/dev/null || echo "0")
    local saved=$((size_before - size_after))
    local percent_saved=0
    if [[ $size_before -gt 0 ]]; then
        percent_saved=$(( (saved * 100) / size_before ))
    fi
    
    if [[ $saved -gt 0 ]]; then
        echo -e "   ${GREEN}✅ Optimizada: ${saved} bytes ahorrados (${percent_saved}%)${NC}"
    else
        echo "   ℹ️  Ya optimizada"
    fi
}

# Función para generar WebP
generate_webp() {
    local file="$1"
    local webp_file="${file%.*}.webp"
    
    # Solo si no existe ya el WebP
    if [[ ! -f "$webp_file" ]]; then
        echo "   🔄 Generando WebP..."
        # Usar sips para convertir a WebP (macOS Monterey+)
        if sips -s format webp -s formatOptions 80 "$file" --out "$webp_file" > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ WebP creado${NC}"
        else
            echo "   ⚠️  WebP no soportado en este sistema"
        fi
    fi
}

# Contadores
total_files=0
processed_files=0
total_saved=0

echo -e "${BLUE}📁 Buscando imágenes en: $TARGET_DIR${NC}"

# Procesar todas las imágenes
while IFS= read -r -d '' file; do
    ((total_files++))
    
    # Obtener tamaño original
    size_before=$(stat -f%z "$file" 2>/dev/null || echo "0")
    
    # Solo procesar si es mayor a 100KB
    if [[ $size_before -gt 102400 ]]; then
        optimize_image "$file"
        generate_webp "$file"
        ((processed_files++))
        
        # Calcular ahorro total
        size_after=$(stat -f%z "$file" 2>/dev/null || echo "0")
        saved=$((size_before - size_after))
        total_saved=$((total_saved + saved))
    fi
    
done < <(find "$TARGET_DIR" \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -type f -print0)

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}🎉 Optimización completada${NC}"
echo -e "${GREEN}📊 Estadísticas:${NC}"
echo -e "   • Archivos encontrados: $total_files"
echo -e "   • Archivos procesados: $processed_files"
if [[ $total_saved -gt 0 ]]; then
    echo -e "   • Espacio ahorrado: $total_saved bytes"
    echo -e "   • Ahorro en MB: $((total_saved / 1024 / 1024))MB"
fi
echo -e "   • Backups en: $BACKUP_DIR"

echo -e "${YELLOW}💡 Tip: Ejecuta este script cada vez que agregues nuevas imágenes${NC}"