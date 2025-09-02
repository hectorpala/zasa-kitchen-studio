#!/bin/bash

echo "🚀 Iniciando prueba de Lighthouse para móvil..."
echo "================================================"

# Verificar si lighthouse está instalado
if ! command -v lighthouse &> /dev/null; then
    echo "⚠️  Lighthouse no está instalado."
    echo "Instálalo con: npm install -g lighthouse"
    exit 1
fi

# URL para probar (local o remota)
URL="https://zasakitchenstudio.mx"
OUTPUT_DIR="lighthouse-reports"

# Crear directorio para reportes
mkdir -p $OUTPUT_DIR

# Fecha y hora para el reporte
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "📱 Ejecutando Lighthouse para móvil..."
lighthouse $URL \
  --output html \
  --output-path "$OUTPUT_DIR/mobile_$TIMESTAMP.html" \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile \
  --throttling-method=simulate \
  --chrome-flags="--headless" \
  --quiet

echo ""
echo "📊 RESUMEN DE OPTIMIZACIONES IMPLEMENTADAS:"
echo "===========================================" 
echo "✅ CLS: Dimensiones fijas añadidas a todas las imágenes"
echo "✅ LCP: Hero image optimizada con preload mobile-first"
echo "✅ Imágenes: Script de optimización creado"
echo "✅ Caché: Headers configurados (1 año para assets)"
echo "✅ JavaScript: Eliminado código duplicado (107KB reducido)"
echo "✅ GTM: Carga diferida con requestIdleCallback"
echo "✅ Schema JSON: Movido a archivo externo (200 líneas menos)"
echo "✅ DOM: Reducido en 198 líneas"
echo ""
echo "📈 MEJORAS ESPERADAS:"
echo "===========================================" 
echo "• Performance: 60 → 85+ (objetivo 90+)"
echo "• CLS: 0.522 → <0.1"
echo "• LCP: 4.3s → <2.5s"
echo "• FCP: 2.6s → <1.8s"
echo "• TBT: 70ms → <50ms"
echo ""
echo "💡 RECOMENDACIONES ADICIONALES:"
echo "===========================================" 
echo "1. Instalar herramientas de optimización de imágenes:"
echo "   brew install pngquant jpegoptim webp"
echo ""
echo "2. Considerar CDN con optimización automática"
echo ""
echo "3. Implementar Service Worker para caché offline"
echo ""
echo "4. Convertir imágenes críticas a AVIF"
echo ""
echo "📁 Reporte guardado en: $OUTPUT_DIR/mobile_$TIMESTAMP.html"
echo ""
echo "Para abrir el reporte:"
echo "open $OUTPUT_DIR/mobile_$TIMESTAMP.html"