#!/bin/bash

# === CONFIG ===
SRC="img/CONTENIDO ZASA"
DEST_BASE="img"
[ -d "public/img" ] && DEST_BASE="public/img"
DEST="$DEST_BASE/proyectos"
mkdir -p "$DEST"

# Target dimensions for web images
WIDTH=800
HEIGHT=534

echo "=== ZASA Kitchen Image Processing ==="
echo "Source: $SRC"
echo "Destination: $DEST"
echo "Target size: ${WIDTH}x${HEIGHT}"
echo ""

# Function to process images from a project folder
process_project() {
    local project_folder="$1"
    local location_id="$2"
    local project_path="$SRC/$project_folder"
    
    if [ ! -d "$project_path" ]; then
        echo "⚠️  Project folder not found: $project_path"
        return
    fi
    
    echo "📁 Processing: $project_folder → $location_id"
    
    # Find image files (common formats)
    local images=($(find "$project_path" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.tiff" -o -iname "*.tif" \) | head -3))
    
    if [ ${#images[@]} -eq 0 ]; then
        echo "   ⚠️  No images found in $project_folder"
        return
    fi
    
    # Process up to 3 images
    for i in "${!images[@]}"; do
        local img="${images[$i]}"
        local num=$(printf "%02d" $((i + 1)))
        local output="$DEST/${location_id}-${num}.jpg"
        
        echo "   🖼️  Processing image $((i + 1)): $(basename "$img")"
        
        # Use sips to resize and convert
        sips -z $HEIGHT $WIDTH --setProperty format jpeg --setProperty formatOptions 85 "$img" --out "$output" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "   ✅ Created: $output"
        else
            echo "   ❌ Failed to process: $(basename "$img")"
        fi
    done
    
    echo ""
}

# Project mapping based on our HTML structure
echo "🚀 Starting image processing..."
echo ""

# Centro / Consolidada
process_project "Cocina Benevento" "centro"
process_project "Cocina San Alberto" "guadalupe" 

# Alto poder adquisitivo  
process_project "Cocina Cuatro Rios" "tres-rios"
process_project "Cocina Alfredo Rios" "la-primavera"
process_project "Cocina Marcela Cota" "country-alamos"
process_project "Cocina Radames Ley" "montebello"

# Desarrollos residenciales
process_project "Cocina Benevento" "benevento"
process_project "Cocina Villas del Rio" "villas-del-rio"
process_project "Cocina Casandra Espinoza" "portalegre"
process_project "Cocina Maria de Jesus" "terranova"

# Otras zonas
process_project "Cocina Elia Martinez" "infonavit-humaya"
process_project "Cocina Rogelio Apodaca" "lomas-de-guadalupe"
process_project "Cocina Nallely Sandoval" "la-conquista"
process_project "Jairo Chaparro" "horizontes"
process_project "Bajo escaleras Guillermo Arriaga" "chulavista"

echo "🎉 Image processing completed!"
echo ""
echo "📊 Summary:"
echo "   Source folder: $SRC"
echo "   Output folder: $DEST"
echo "   Format: JPEG (85% quality)"
echo "   Size: ${WIDTH}x${HEIGHT}px"
echo ""
echo "📝 Next steps:"
echo "   1. Check the generated images in: $DEST"
echo "   2. Optionally convert to WebP format when you have webp tools"
echo "   3. Update HTML if needed to use .jpg instead of .webp"
echo ""
echo "💡 To convert to WebP later (when you have the tools):"
echo "   for img in $DEST/*.jpg; do"
echo "     cwebp -q 85 \"\$img\" -o \"\${img%.jpg}.webp\""
echo "   done"