#!/bin/bash

# Script simplificado para actualizar favicon.svg a favicon completo
echo "🔄 Actualizando referencias de favicon.svg..."

# Buscar archivos que contengan favicon.svg
files_with_favicon=$(find . -name "*.html" -type f -exec grep -l 'favicon\.svg' {} \;)

for file in $files_with_favicon; do
    echo "📝 Actualizando: $file"
    
    # Crear backup del archivo
    cp "$file" "$file.bak"
    
    # Reemplazar solo la línea específica del favicon.svg
    sed -i '' 's|<link rel="icon" type="image/svg+xml" href="/favicon.svg">|<link rel="icon" type="image/x-icon" href="/favicon.ico">|g' "$file"
    
    # Si el archivo no tiene las otras referencias de favicon, agregarlas después del favicon.ico
    if ! grep -q 'favicon-32x32.png' "$file"; then
        sed -i '' '/<link rel="icon" type="image\/x-icon" href="\/favicon.ico">/a\
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">\
  <link rel="manifest" href="/site.webmanifest">\
  <meta name="theme-color" content="#ff6600">
' "$file"
    fi
done

echo "✅ Referencias de favicon actualizadas"
echo ""
echo "🔍 Verificando referencias restantes a favicon.svg:"
if find . -name "*.html" -type f -exec grep -l 'favicon\.svg' {} \; | head -3; then
    echo "⚠️  Aún quedan algunas referencias"
else
    echo "✅ Todas las referencias fueron actualizadas"
fi