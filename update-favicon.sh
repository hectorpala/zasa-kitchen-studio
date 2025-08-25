#!/bin/bash

# Script para actualizar todas las referencias de favicon en archivos HTML

echo "🔄 Actualizando referencias de favicon en todos los archivos HTML..."

# Nuevo bloque de favicon completo
FAVICON_BLOCK='  <!-- Favicon and App Icons -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#ff6600">'

# Buscar y reemplazar en todos los archivos HTML
find . -name "*.html" -type f | while read file; do
    if grep -q 'rel="icon".*favicon\.svg' "$file"; then
        echo "📝 Actualizando: $file"
        # Usar sed para reemplazar la línea del favicon.svg con el bloque completo
        sed -i '' 's|  <link rel="icon" type="image/svg+xml" href="/favicon.svg">|'"${FAVICON_BLOCK}"'|g' "$file"
    fi
done

echo "✅ Referencias de favicon actualizadas en todos los archivos HTML"

# Verificar que no queden referencias al favicon.svg
echo ""
echo "🔍 Verificando referencias restantes a favicon.svg:"
if grep -r "favicon\.svg" --include="*.html" . | head -5; then
    echo "⚠️  Aún quedan algunas referencias a favicon.svg"
else
    echo "✅ Todas las referencias fueron actualizadas"
fi