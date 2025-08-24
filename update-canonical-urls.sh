#!/bin/bash

echo "🔗 Actualizando URLs canónicas para producción..."

# Dominio final de producción
DOMAIN="https://zasakitchen.com"

# Función para actualizar URLs canónicas en un archivo
update_canonical() {
    local file="$1"
    local canonical_path="$2"
    
    if [ -f "$file" ]; then
        echo "Actualizando canonical en: $file → $DOMAIN$canonical_path"
        # Actualizar canonical URL
        sed -i '' "s|<link rel=\"canonical\" href=\"[^\"]*\">|<link rel=\"canonical\" href=\"$DOMAIN$canonical_path\">|g" "$file"
        sed -i '' "s|<link rel='canonical' href='[^']*'>|<link rel='canonical' href='$DOMAIN$canonical_path'>|g" "$file"
        
        # Actualizar Open Graph URL
        sed -i '' "s|<meta property=\"og:url\" content=\"[^\"]*\">|<meta property=\"og:url\" content=\"$DOMAIN$canonical_path\">|g" "$file"
        sed -i '' "s|<meta property='og:url' content='[^']*'>|<meta property='og:url' content='$DOMAIN$canonical_path'>|g" "$file"
    fi
}

# Actualizar páginas principales
update_canonical "index.html" "/"
update_canonical "contacto/index.html" "/contacto/"
update_canonical "blog/index.html" "/blog/"
update_canonical "servicios/index.html" "/servicios/"

# Actualizar páginas de servicios principales
update_canonical "servicios/cocinas/cocinas-integrales.html" "/servicios/cocinas/cocinas-integrales/"
update_canonical "servicios/cocinas/cocinas-modernas.html" "/servicios/cocinas/cocinas-modernas/"
update_canonical "servicios/cocinas/integrales-en-l.html" "/servicios/cocinas/integrales-en-l/"
update_canonical "servicios/cocinas/integrales-en-u.html" "/servicios/cocinas/integrales-en-u/"
update_canonical "servicios/cocinas/integrales-con-isla.html" "/servicios/cocinas/integrales-con-isla/"

# Actualizar páginas de cubiertas
update_canonical "servicios/cubiertas/cubiertas-cuarzo-culiacan.html" "/servicios/cubiertas/cubiertas-cuarzo-culiacan/"
update_canonical "servicios/cubiertas/cubiertas-granito-culiacan.html" "/servicios/cubiertas/cubiertas-granito-culiacan/"
update_canonical "servicios/cubiertas/cubiertas-marmol-culiacan.html" "/servicios/cubiertas/cubiertas-marmol-culiacan/"

# Actualizar closets
update_canonical "servicios/closets-culiacan.html" "/servicios/closets-culiacan/"

# Actualizar proyectos principales
update_canonical "proyectos-culiacan/tres-rios.html" "/proyectos-culiacan/tres-rios/"
update_canonical "proyectos-culiacan/benevento.html" "/proyectos-culiacan/benevento/"
update_canonical "proyectos-culiacan/la-primavera.html" "/proyectos-culiacan/la-primavera/"
update_canonical "proyectos-culiacan/chapultepec.html" "/proyectos-culiacan/chapultepec/"

# Actualizar colonias principales
update_canonical "colonias/tres-rios.html" "/colonias/tres-rios/"
update_canonical "colonias/country-alamos.html" "/colonias/country-alamos/"
update_canonical "colonias/chapultepec.html" "/colonias/chapultepec/"
update_canonical "colonias/centro.html" "/colonias/centro/"
update_canonical "colonias/la-primavera.html" "/colonias/la-primavera/"

echo "✅ URLs canónicas actualizadas para producción: $DOMAIN"