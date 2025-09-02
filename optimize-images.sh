#!/bin/bash

# Script para optimizar imágenes del sitio web
# Reduce el peso de las imágenes manteniendo la calidad visual

echo "🖼️ Iniciando optimización de imágenes..."

# Comprimir imágenes PNG grandes
if command -v pngquant &> /dev/null; then
    echo "Optimizando PNGs con pngquant..."
    find assets/hero -name "*.png" -size +100k -exec pngquant --force --quality=70-85 --ext .png {} \;
    find img -name "*.png" -size +100k -exec pngquant --force --quality=70-85 --ext .png {} \;
else
    echo "⚠️  pngquant no instalado. Instala con: brew install pngquant"
fi

# Optimizar JPEGs
if command -v jpegoptim &> /dev/null; then
    echo "Optimizando JPEGs..."
    find img -name "*.jpg" -o -name "*.jpeg" | xargs -I {} jpegoptim -m85 --strip-all {}
else
    echo "⚠️  jpegoptim no instalado. Instala con: brew install jpegoptim"
fi

# Convertir a WebP si es posible
if command -v cwebp &> /dev/null; then
    echo "Convirtiendo a WebP..."
    for img in img/optimized/servicios/*.jpg; do
        if [ -f "$img" ]; then
            output="${img%.jpg}.webp"
            cwebp -q 85 "$img" -o "$output"
        fi
    done
else
    echo "⚠️  cwebp no instalado. Instala con: brew install webp"
fi

# Optimizar SVGs
if command -v svgo &> /dev/null; then
    echo "Optimizando SVGs..."
    find . -name "*.svg" -exec svgo {} \;
else
    echo "⚠️  svgo no instalado. Instala con: npm install -g svgo"
fi

echo "✅ Optimización completada"
echo "📊 Tamaños actuales de imágenes hero:"
ls -lh assets/hero/*.webp

echo ""
echo "💡 Recomendaciones adicionales:"
echo "1. Instala herramientas faltantes para mejor optimización"
echo "2. Considera usar servicios CDN con optimización automática"
echo "3. Implementa lazy loading para imágenes below-the-fold"