#!/bin/bash

# Script para limpiar y optimizar el HTML
echo "🧹 Limpiando HTML..."

# Backup
cp index.html index.html.backup

# Eliminar Schema JSON comentado (líneas 148-345)
sed -i '' '148,345d' index.html

# Eliminar comentarios HTML innecesarios (manteniendo GTM)
sed -i '' '/<!-- Schema inline eliminado/d' index.html
sed -i '' '/<!-- Placeholder mínimo/d' index.html

echo "✅ HTML optimizado"
echo "📊 Reducción de tamaño:"
echo "Antes: $(wc -l < index.html.backup) líneas"
echo "Después: $(wc -l < index.html) líneas"
echo "Reducción: $(($(wc -l < index.html.backup) - $(wc -l < index.html))) líneas"