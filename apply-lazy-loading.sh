#!/bin/bash
# Script para aplicar lazy loading universal

echo "Aplicando lazy loading universal..."

# Buscar todos los archivos HTML principales
find . -name "*.html" -not -path "./stile-backup*" -not -path "./index.htmel*" -not -path "./.git*" | while read file; do
  
  # Skip si ya tiene el script
  if grep -q "lazy-loading.js" "$file"; then
    echo "✓ $file ya tiene lazy loading"
    continue
  fi
  
  # Agregar loading="lazy" a imágenes que no sean hero
  sed -i.bak 's/<img \([^>]*\)src="\([^"]*\)"/<img \1src="\2" loading="lazy"/g' "$file"
  
  # Remover lazy de hero images (logo navbar y hero)
  sed -i.bak 's/<img \([^>]*\)logo\([^>]*\) loading="lazy"/<img \1logo\2/g' "$file"
  sed -i.bak 's/<img \([^>]*\)hero\([^>]*\) loading="lazy"/<img \1hero\2/g' "$file"
  
  # Agregar script antes del </body>
  sed -i.bak 's|</body>|<script src="/lazy-loading.js"></script>\n</body>|g' "$file"
  
  # Limpiar backups
  rm -f "$file.bak"
  
  echo "✓ Lazy loading agregado a $file"
done

echo "Lazy loading aplicado a todas las páginas."