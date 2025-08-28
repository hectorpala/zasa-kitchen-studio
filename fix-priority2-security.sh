#!/bin/bash

# Priority 2 Security & Performance Fix
# Adds rel="noopener noreferrer" to external target="_blank" links
# Adds loading="eager" to navbar logos for critical path performance

echo "🔧 Aplicando correcciones Priority 2..."

# Find all HTML files (excluding backups and test files)
find . -name "*.html" -not -path "./index.htmel/*" -not -path "./stile-backup-*/*" -not -path "./img-backups/*" | while IFS= read -r file; do
    echo "Procesando: $file"
    
    # Fix navbar logo loading (critical path performance)
    sed -i '' 's|<img src="/img/logo-zasa.jpg" alt="Zasa Kitchen Studio" class="logo-navbar">|<img src="/img/logo-zasa.jpg" alt="Zasa Kitchen Studio" class="logo-navbar" loading="eager">|g' "$file"
    
    # Add rel="noopener noreferrer" to any remaining target="_blank" without rel
    sed -i '' 's|target="_blank"\([^>]*\)\([^r]\)>|target="_blank"\1 rel="noopener noreferrer">|g' "$file"
    
    # Also handle the case where there might already be partial rel but missing noreferrer
    sed -i '' 's|target="_blank" rel="noopener">|target="_blank" rel="noopener noreferrer">|g' "$file"
done

echo "✅ Correcciones Priority 2 completadas!"
echo "📊 Resumen de cambios:"
echo "- Navbar logos con loading='eager' para mejor CLS"
echo "- Enlaces externos con target='_blank' protegidos con rel='noopener noreferrer'"