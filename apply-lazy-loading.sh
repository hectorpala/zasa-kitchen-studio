#!/bin/bash

echo "🚀 Aplicando lazy loading a imágenes optimizadas..."

# Script para aplicar lazy loading automáticamente
update_image_references() {
    local file="$1"
    echo "Procesando: $file"
    
    # Actualizar referencias de imágenes a versiones optimizadas (solo en HTML, no CSS)
    if [[ "$file" == *.html ]]; then
        sed -i '' \
            -e 's/img\/placeholder-cocina\.jpg/img\/optimized\/placeholder-optimized.jpg/g' \
            -e 's/img\/beneficio-\([1-6]\)\.jpg/img\/optimized\/beneficio-\1-optimized.jpg/g' \
            -e 's/img\/chapalita\.jpg/img\/optimized\/chapalita-optimized.jpg/g' \
            -e 's/img\/country\.jpg/img\/optimized\/country-optimized.jpg/g' \
            -e 's/img\/tres-rios\.jpg/img\/optimized\/tres-rios-optimized.jpg/g' \
            -e 's/img\/cuarzo\.jpg/img\/optimized\/cuarzo-optimized.jpg/g' \
            -e 's/img\/granito\.jpg/img\/optimized\/granito-optimized.jpg/g' \
            -e 's/img\/marmol\.jpg/img\/optimized\/marmol-optimized.jpg/g' \
            -e 's/img\/closets\.jpg/img\/optimized\/closets-optimized.jpg/g' \
            -e 's/img\/cocinas-modernas\.jpg/img\/optimized\/cocinas-modernas-optimized.jpg/g' \
            "$file"
    fi
}

# Procesar archivos HTML principales
for file in index.html contacto/index.html blog/index.html; do
    if [ -f "$file" ]; then
        update_image_references "$file"
    fi
done

# Procesar páginas de servicios
find servicios -name "*.html" -type f | while read file; do
    update_image_references "$file"
done

echo "✅ Referencias de imágenes actualizadas a versiones optimizadas"
