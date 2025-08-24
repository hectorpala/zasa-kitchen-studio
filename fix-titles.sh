#!/bin/bash
# Script para acortar títulos >60 caracteres

echo "Acortando títulos largos..."

# Función para acortar títulos de colonias
fix_colonia_titles() {
  find colonias/ -name "*.html" -not -name "index.html" | while read file; do
    # Cambiar "Cocinas Integrales en [Colonia] | ZASA Kitchen Studio" 
    # por "Cocinas [Colonia] | ZASA Kitchen Studio"
    sed -i.bak 's/<title>Cocinas Integrales en \([^|]*\) | ZASA Kitchen Studio<\/title>/<title>Cocinas \1 | ZASA Kitchen Studio<\/title>/g' "$file"
    
    # Si sigue siendo largo, acortar más
    sed -i.bak 's/<title>Cocinas \([^|]*\) | ZASA Kitchen Studio<\/title>/<title>Cocinas \1 | ZASA<\/title>/g' "$file"
    
    rm -f "$file.bak"
    echo "✓ Título acortado en $file"
  done
}

# Función para acortar títulos de servicios
fix_service_titles() {
  find servicios/ -name "*.html" | while read file; do
    # Cambiar títulos largos de servicios
    sed -i.bak 's/<title>\([^|]*\) | Diseño, Fabricación e Instalación<\/title>/<title>\1 | ZASA<\/title>/g' "$file"
    sed -i.bak 's/<title>\([^|]*\) | ZASA Kitchen Studio<\/title>/<title>\1 | ZASA<\/title>/g' "$file"
    
    rm -f "$file.bak"
    echo "✓ Título de servicio acortado en $file"
  done
}

# Función para acortar títulos de proyectos
fix_project_titles() {
  find proyectos-culiacan/ -name "*.html" -not -name "index.html" | while read file; do
    sed -i.bak 's/<title>\([^|]*\) | ZASA Kitchen Studio<\/title>/<title>\1 | ZASA<\/title>/g' "$file"
    
    rm -f "$file.bak" 
    echo "✓ Título de proyecto acortado en $file"
  done
}

# Ejecutar todas las funciones
fix_colonia_titles
fix_service_titles  
fix_project_titles

echo "Títulos acortados completados."