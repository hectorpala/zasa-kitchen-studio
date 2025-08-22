#!/bin/bash
# Script de optimización de imágenes para Zasa Kitchen

echo "🖼️ Optimizando imágenes para mejor performance..."

# Crear directorio si no existe
mkdir -p img/optimized

# Optimizar imágenes principales con sips (macOS)
echo "Optimizando hero.jpg..."
sips -Z 1920 --setProperty formatOptions 75 img/hero.jpg --out img/optimized/hero-optimized.jpg 2>/dev/null

echo "Optimizando placeholder-cocina.jpg..."
sips -Z 800 --setProperty formatOptions 75 img/placeholder-cocina.jpg --out img/optimized/placeholder-optimized.jpg 2>/dev/null

echo "Optimizando cocinaintegrales.png..."
sips -Z 800 --setProperty formatOptions 80 "img/cocinas integrales/cocinaintegrales.png" --out img/optimized/cocinaintegrales-optimized.jpg 2>/dev/null

# Mostrar ahorro de espacio
echo "📊 Comparación de tamaños:"
echo "Original hero.jpg: $(ls -lh img/hero.jpg | awk '{print $5}')"
echo "Optimizado: $(ls -lh img/optimized/hero-optimized.jpg | awk '{print $5}')"
echo ""
echo "Original cocinaintegrales.png: $(ls -lh 'img/cocinas integrales/cocinaintegrales.png' | awk '{print $5}')"
echo "Optimizado: $(ls -lh img/optimized/cocinaintegrales-optimized.jpg | awk '{print $5}')"

echo "✅ Optimización completada!"