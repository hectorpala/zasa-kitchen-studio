const fs = require('fs');
const path = require('path');

// Lista completa de colonias
const colonias = [
  "Acueducto", "Alturas del Sur", "Antonio Nakayama", "Aurora", "Azaleas Residencial",
  "Bachigualato", "Balcones del Humaya", "Benito Juárez", "Bonaterra", "Bosques del Humaya",
  "Bosques del Río", "Brisas de Humaya", "Burócrata", "Campestre", "Campestre Los Laureles",
  "Campo Bello", "Cañadas", "Capistrano Residencial", "Centro", "Chapultepec",
  "Chapultepec del Río", "Colinas de San Miguel", "Colinas del Humaya", "Comunicadores", "Country Álamos",
  "Country del Río", "Country Tres Ríos", "Del Humaya", "Desarrollo Urbano Tres Ríos", "Diana Laura R. de Colosio",
  "Domingo Rubí", "El Barrio", "El Mirador", "El Vallado", "Emiliano Zapata",
  "Felipe Ángeles", "Ferrocarrilera", "Fincas del Humaya", "Florida", "FOVISSSTE Abelardo de la Torre",
  "FOVISSSTE Humaya", "Francisco I. Madero", "Francisco Labastida Ochoa", "Francisco Villa", "Fuentes del Valle",
  "Gabriel Leyva", "Genaro Estrada", "Girasoles", "Grecia", "Guadalupe",
  "Guadalupe Victoria", "Gustavo Díaz Ordaz", "Heraclio Bernal", "Hermanos Flores Magón", "Horizontes",
  "Huizaches", "Humaya", "Ignacio Allende", "Independencia", "Industrial El Palmito",
  "INFONAVIT Barrancos", "INFONAVIT Cañadas", "INFONAVIT Humaya", "Interlomas", "Isla Musalá",
  "Jardines de la Sierra", "Jardines del Pedregal", "Jardines del Rey", "Jardines del Río", "Jardines del Valle",
  "Jorge Almada", "Josefa Ortiz de Domínguez", "Juntas de Humaya", "La Campiña", "La Conquista",
  "La Costera", "La Lima", "La Primavera", "La Ribera Residencial", "La Rioja",
  "Las Américas", "Las Coloradas", "Las Huertas", "Las Ilusiones", "Las Moras",
  "Las Palmas", "Las Quintas", "Las Terrazas", "Las Vegas", "Laureles",
  "Lázaro Cárdenas", "Libertad", "Limita de Hitaje", "Loma de Rodriguera", "Loma Linda",
  "Lomas de Guadalupe", "Lomas del Boulevard", "Lomas del Humaya", "Lomas del Magisterio", "Lomas del Pedregal",
  "Lomas del Sol", "Lomas de San Isidro", "Lomas Verdes", "Los Álamos", "Los Pinos",
  "Los Portales", "Los Sauces", "Magnolias Residencial", "Mallorca Residencial", "Mercado de Abastos",
  "Miguel Alemán", "Miguel de la Madrid", "Miguel Hidalgo", "Miravalle", "Montebello",
  "Morelos", "Músala Isla Bonita", "Nueva Galicia", "Nueva Vizcaya", "Nuevo Bachigualato",
  "Nuevo Culiacán", "Nuevo México", "Obrero Campesino", "Palermo", "Palmillas Residencial",
  "Paraíso", "Paseo del Río", "Paseos del Valle", "Pedregal del Humaya", "Perisur",
  "Plutarco Elías Calles", "Portales del Country", "Portales del Río", "Pradera Dorada", "Praderas del Humaya",
  "Praderas del Rey", "Prados de la Conquista", "Prados del Sol", "Prados del Sur", "Progreso",
  "Providencia", "Puerta de Hierro", "Quinta Americana", "Rafael Buelna", "Real de Chapultepec",
  "Real del Álamo", "Real del Country", "Real del Parque", "Real de Minas", "Real de Santa Fe",
  "Real San Ángel", "Santa Margarita", "Stanza Toscana", "Tierra Blanca", "Tres Ríos",
  "Universitarios", "Valle Alto", "Villa Fontana", "Villa Universidad", "Villa Verde", "Villas del Río"
];

// Función para crear slug de URL
function createSlug(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e') 
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim('-');
}

// Leer la plantilla
const templatePath = path.join(__dirname, 'colonias', 'template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Crear directorio de colonias si no existe
const coloniasDir = path.join(__dirname, 'colonias');
if (!fs.existsSync(coloniasDir)) {
  fs.mkdirSync(coloniasDir, { recursive: true });
}

// Generar página para cada colonia
colonias.forEach(colonia => {
  const slug = createSlug(colonia);
  
  // Reemplazar placeholders en la plantilla
  let pageContent = template
    .replace(/\{\{COLONIA_NAME\}\}/g, colonia)
    .replace(/\{\{COLONIA_SLUG\}\}/g, slug);
  
  // Crear archivo
  const fileName = `${slug}.html`;
  const filePath = path.join(coloniasDir, fileName);
  
  fs.writeFileSync(filePath, pageContent, 'utf8');
  console.log(`✅ Creada página para: ${colonia} (${fileName})`);
});

console.log(`\n🎉 Se generaron ${colonias.length} páginas de colonias exitosamente!`);
console.log(`📁 Ubicación: ${coloniasDir}`);

// Generar archivo de índice con todos los enlaces
const indexContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa del sitio - Colonias | ZASA Kitchen Studio</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; }
    .colonia-link { display: block; padding: 10px; background: #f5f5f5; text-decoration: none; color: #333; border-radius: 5px; }
    .colonia-link:hover { background: #e0e0e0; }
  </style>
</head>
<body>
  <h1>Páginas de Colonias - ZASA Kitchen Studio</h1>
  <p>Total de páginas generadas: ${colonias.length}</p>
  <div class="grid">
${colonias.map(colonia => `    <a href="${createSlug(colonia)}.html" class="colonia-link">${colonia}</a>`).join('\n')}
  </div>
  <hr>
  <p><a href="../index.html">← Volver al sitio principal</a></p>
</body>
</html>`;

fs.writeFileSync(path.join(coloniasDir, 'index.html'), indexContent, 'utf8');
console.log(`📄 Creado índice de colonias: colonias/index.html`);