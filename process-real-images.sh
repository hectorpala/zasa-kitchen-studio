#!/bin/bash

# === CONFIG ===
SRC="img/CONTENIDO ZASA"
DEST="img/proyectos"
mkdir -p "$DEST"

WIDTH=800
HEIGHT=534

echo "=== ZASA Real Image Processing ==="
echo "Processing actual kitchen photos to web format"
echo ""

# Process specific project with actual images
process_actual_project() {
    local project_folder="$1"
    local location_id="$2"
    
    echo "📁 $project_folder → $location_id"
    
    # Find actual JPEG files (with proper paths)
    local images=($(find "$SRC/$project_folder" -name "*.jpeg" -o -name "*.jpg" | head -3))
    
    if [ ${#images[@]} -eq 0 ]; then
        echo "   ⚠️  No images found"
        return
    fi
    
    for i in "${!images[@]}"; do
        local img="${images[$i]}"
        local num=$(printf "%02d" $((i + 1)))
        local output="$DEST/${location_id}-${num}.jpg"
        
        echo "   📸 $(basename "$img")"
        
        # Process with sips
        sips -z $HEIGHT $WIDTH --setProperty format jpeg --setProperty formatOptions 85 "$img" --out "$output" &>/dev/null
        
        if [ -f "$output" ]; then
            echo "   ✅ $output"
        else
            echo "   ❌ Failed"
        fi
    done
    echo ""
}

# Process available projects
process_actual_project "Cocina Alfredo Rios" "tres-rios"
process_actual_project "Cocina Benevento " "benevento"
process_actual_project "Cocina Marcela Cota" "country-alamos"
process_actual_project "Cocina Radames Ley" "montebello"
process_actual_project "Cocina Elia Martinez" "infonavit-humaya"
process_actual_project "Cocina San Alberto" "guadalupe"
process_actual_project "Cocina Cuatro Rios " "centro"
process_actual_project "Jairo Chaparro" "horizontes"
process_actual_project "Bajo escaleras Guillermo Arriaga" "chulavista"

echo "🎉 Processing complete!"
echo ""
echo "📊 Generated files:"
ls -la "$DEST"/*.jpg 2>/dev/null || echo "   No files generated"
echo ""
echo "📝 Next: Update HTML to use actual project images instead of placeholders"