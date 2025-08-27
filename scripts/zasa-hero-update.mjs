// START scripts/zasa-hero-update.mjs
import fs from "fs/promises";
import sharp from "sharp";
import * as cheerio from "cheerio";
import path from "path";

const sizes = [1920,1600,1200,800,480];
const outDir = "assets/hero";
const outBase = path.join(outDir, "culiacan-hero");
const rawPreferred = "assets/raw/culiacan-hero.jpg";

const exists = async p => !!(await fs.stat(p).catch(()=>null));
const firstExisting = async arr => { for (const p of arr) if (await exists(p)) return p; return null; };

const indexPath = await firstExisting(["index.html","public/index.html"]);
if (!indexPath) { console.error("No encuentro index.html (raíz o /public)."); process.exit(1); }

const stylePath = (await firstExisting(["assets/css/style.css","css/overrides.css","css/style.css","styles.css","style.css"])) || "css/overrides.css";
await fs.mkdir("assets/raw",{recursive:true});
await fs.mkdir(outDir,{recursive:true});

// Imagen fuente
let srcImage = rawPreferred;
if (!(await exists(srcImage))) {
  const html0 = await fs.readFile(indexPath,"utf8");
  const $0 = cheerio.load(html0);
  const hero = $0("section.hero,.hero,header.hero").first();
  let found = null;
  if (hero.length) {
    const img = hero.find("img").first();
    if (img.length) found = img.attr("src");
  }
  if (found && await exists(found)) srcImage = found;
  else { console.error("Coloca la imagen fuente en assets/raw/culiacan-hero.jpg"); process.exit(1); }
}

console.log(`Procesando: ${srcImage}`);

// Recorte 21:9 centrado y exportes WebP
const meta = await sharp(srcImage).metadata();
const targetH = Math.round((meta.width / 21) * 9);
const top = Math.max(0, Math.round((meta.height - targetH)/2));

console.log(`Original: ${meta.width}x${meta.height} -> Recorte 21:9: ${meta.width}x${targetH}`);

for (const w of sizes) {
  await sharp(srcImage)
    .extract({ left:0, top, width:meta.width, height:targetH })
    .resize({ width:w })
    .webp({ quality:82 })
    .toFile(`${outBase}-${w}.webp`);
  console.log(`✓ ${outBase}-${w}.webp`);
}

// Actualizar HTML
const html = await fs.readFile(indexPath,"utf8");
const $ = cheerio.load(html, { decodeEntities:false });

const hero = $("section.hero,.hero,header.hero").first();
if (hero.length) {
  console.log("Actualizando hero en HTML...");
  
  // Limpiar background-image del CSS inline
  const inlineStyle = $("style").first();
  if (inlineStyle.length) {
    let css = inlineStyle.html();
    css = css.replace(/\.hero\s*\{[^}]*background-image[^}]*\}/g, 
      '.hero{min-height:85vh;display:grid;place-items:center;text-align:center;position:relative;contain:layout}');
    inlineStyle.html(css);
  }
  
  // Agregar <figure> con imagen responsive
  const heroFigure = `
<figure class="hero-figure">
  <img src="assets/hero/culiacan-hero-1600.webp"
       srcset="assets/hero/culiacan-hero-480.webp 480w, assets/hero/culiacan-hero-800.webp 800w, assets/hero/culiacan-hero-1200.webp 1200w, assets/hero/culiacan-hero-1600.webp 1600w, assets/hero/culiacan-hero-1920.webp 1920w"
       sizes="100vw"
       alt="Cocina integral moderna en Culiacán — Zasa Kitchen Studio"
       loading="eager" fetchpriority="high"
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;" />
</figure>`.trim();
  
  hero.prepend(heroFigure);
  
  await fs.writeFile(indexPath, $.html(), "utf8");
  console.log("✓ index.html actualizado");
} else {
  console.error("No encontré elemento .hero en index.html");
}

// Actualizar CSS
const cssContent = await fs.readFile(stylePath, "utf8").catch(() => "");
const newCSSRules = `

/* Hero responsive 21:9 con overlay solo en móvil */
.hero-figure {
  position: absolute;
  inset: 0;
  margin: 0;
  z-index: -1;
}

.hero-figure img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* Overlay solo en móvil */
@media (max-width: 640px) {
  .hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.5) 100%);
    z-index: 0;
  }
}

/* Hero container por encima */
.hero .container {
  position: relative;
  z-index: 1;
}
`;

await fs.writeFile(stylePath, cssContent + newCSSRules, "utf8");
console.log(`✓ ${stylePath} actualizado`);

console.log("\n✅ Hero responsive 21:9 aplicado!");
console.log("Preview: http://localhost:5173");