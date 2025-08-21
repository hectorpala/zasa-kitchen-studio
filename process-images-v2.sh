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

echo "=== ZASA Kitchen Image Processing v2 ==="
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
    
    # Find actual image files and take only first 3
    local images=($(find "$project_path" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | head -3))
    
    if [ ${#images[@]} -eq 0 ]; then
        echo "   ⚠️  No JPEG images found in $project_folder"
        return
    fi
    
    # Process up to 3 images
    for i in "${!images[@]}"; do
        local img="${images[$i]}"
        local num=$(printf "%02d" $((i + 1)))
        local output="$DEST/${location_id}-${num}.jpg"
        
        echo "   🖼️  $(basename "$img") → ${location_id}-${num}.jpg"
        
        # Use sips to resize and convert
        sips -z $HEIGHT $WIDTH --setProperty format jpeg --setProperty formatOptions 85 "$img" --out "$output" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "   ✅ Created: $(basename "$output")"
        else
            echo "   ❌ Failed to process: $(basename "$img")"
        fi
    done
    
    echo ""
}

# Map actual project folders to location IDs
echo "🚀 Starting image processing..."
echo ""

# Available projects from our source folder
process_project "Cocina Alfredo Rios" "tres-rios"
process_project "Cocina Benevento " "benevento"
process_project "Cocina Casandra Espinoza " "portalegre"  
process_project "Cocina Cuatro Rios " "centro"
process_project "Cocina Elia Martinez" "infonavit-humaya"
process_project "Cocina Marcela Cota" "country-alamos"
process_project "Cocina Maria de Jesus" "terranova"
process_project "Cocina Radames Ley" "montebello"
process_project "Cocina Rogelio Apodaca" "lomas-de-guadalupe"
process_project "Cocina San Alberto" "guadalupe"
process_project "Cocina Villas del Rio" "villas-del-rio"
process_project "Jairo Chaparro" "horizontes"
process_project "Bajo escaleras Guillermo Arriaga" "chulavista"

echo "🎉 Image processing completed!"
echo ""

# Show what was created
echo "📸 Generated images:"
ls -la "$DEST"/*.jpg 2>/dev/null | wc -l | xargs echo "   Total images:"
echo ""

echo "📝 Next steps:"
echo "   1. Check the generated images in: $DEST"
echo "   2. Update HTML to use .jpg instead of .webp in the src attributes"
echo "   3. Optionally convert to WebP when tools are available"
echo ""

echo "🔧 To update HTML automatically:"
echo "   You'll need to change the img src from placeholder-cocina.webp to the actual .jpg files"