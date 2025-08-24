#!/bin/bash

echo "🔗 Mejorando títulos y meta descriptions consistentes..."

# Mejorar título de la página de contacto para ser más específico
if [ -f "contacto/index.html" ]; then
    sed -i '' 's/<title>Contacto | ZASA Kitchen Studio Culiacán<\/title>/<title>Contacto ZASA Kitchen Studio - Cotización Gratuita Cocinas Culiacán<\/title>/' "contacto/index.html"
fi

# Mejorar título de blog para SEO
if [ -f "blog/index.html" ]; then
    sed -i '' 's/<title>.*<\/title>/<title>Blog Cocinas Integrales Culiacán - Consejos y Tendencias | ZASA<\/title>/' "blog/index.html"
fi

# Mejorar título de servicios principales
if [ -f "servicios/index.html" ]; then
    sed -i '' 's/<title>.*<\/title>/<title>Servicios Cocinas Integrales Culiacán - Diseño, Fabricación, Instalación | ZASA<\/title>/' "servicios/index.html"
fi

echo "✅ Títulos optimizados para mejor SEO"
