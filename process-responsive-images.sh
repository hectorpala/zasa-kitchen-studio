#!/bin/bash
# === CONFIG ===
SRC="img/CONTENIDO ZASA"
DEST_BASE="img"; [ -d "public/img" ] && DEST_BASE="public/img"
DEST="$DEST_BASE/proyectos"; mkdir -p "$DEST"
SIZES=(1600 1200 800 480)
MAX_PER_LOC=3  # 3 fotos por colonia (ajustable)

process_loc () {
  slug="$1"; shift; pats=("$@")
  dir=""; for p in "${pats[@]}"; do dir="$(find "$SRC" -type d -iname "*$p*" | head -n1)"; [ -n "$dir" ] && break; done
  echo "—— $slug  ←  ${dir:-SIN CARPETA (uso placeholders)}"
  n=1; shopt -s nullglob
  if [ -n "$dir" ]; then
    for src in "$dir"/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
      base="${slug}-$(printf '%02d' "$n")"
      for w in "${SIZES[@]}"; do
        out="$DEST/${base}-${w}.jpg"
        sips -s format jpeg -s formatOptions 80 -Z "$w" "$src" --out "$out" >/dev/null
        [ "$w" = "1200" ] && cp -f "$out" "$DEST/${base}.jpg"
      done
      ((n++)); [ $n -gt $MAX_PER_LOC ] && break
    done
  fi
  # si no hubo imágenes reales, rellena con placeholder
  if [ $n -eq 1 ]; then
    [ -f img/placeholder-cocina.jpg ] || cp -f img/hero.jpg img/placeholder-cocina.jpg
    for n in 1 2 3; do
      base="${slug}-$(printf '%02d' "$n")"
      for w in "${SIZES[@]}"; do sips -s format jpeg -s formatOptions 80 -Z "$w" img/placeholder-cocina.jpg --out "$DEST/${base}-${w}.jpg" >/dev/null; done
      cp -f "$DEST/${base}-1200.jpg" "$DEST/${base}.jpg"
    done
  fi
}

# —— SOLO las 8 colonias que ya integraste
process_loc tres-rios          "cuatro rios"
process_loc benevento          "benevento"
process_loc las-quintas        "alfredo rios"
process_loc chapultepec        "radames ley"
process_loc villas-del-rio     "villas del rio" "casandra espinoza"
process_loc infonavit-humaya   "elia martinez"
process_loc horizontes         "jairo chaparro"
process_loc la-primavera       "citlali alvarado"

echo "Listo → $(ls -1 "$DEST" | wc -l) archivos en $DEST"