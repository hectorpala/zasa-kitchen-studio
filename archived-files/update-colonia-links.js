const fs = require('fs');
const path = require('path');

// Lista de colonias con sus slugs
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

// Leer el archivo index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Generar el HTML de la grilla con enlaces
const coloniaLinksHTML = colonias.map(colonia => {
  const slug = createSlug(colonia);
  return `                    <a href="colonias/${slug}.html" class="colonia-item">${colonia}</a>`;
}).join('\n');

// Buscar la sección de colonias y reemplazarla
const startMarker = '<div class="colonias-grid">';
const endMarker = '</div>\n                <div class="cta-buttons">';

const startIndex = indexContent.indexOf(startMarker);
const endIndex = indexContent.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const beforeSection = indexContent.substring(0, startIndex + startMarker.length);
  const afterSection = indexContent.substring(endIndex);
  
  const newContent = beforeSection + '\n' + coloniaLinksHTML + '\n                ' + afterSection;
  
  fs.writeFileSync(indexPath, newContent, 'utf8');
  console.log(`✅ Actualizado index.html con ${colonias.length} enlaces de colonias`);
} else {
  console.log('❌ No se pudo encontrar la sección de colonias en index.html');
}

// Actualizar también el CSS para los enlaces
const cssPath = path.join(__dirname, 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Agregar estilos para enlaces de colonias
const coloniaLinkCSS = `
/* Enlaces de colonias */
.colonia-item {
  display: block;
  text-decoration: none;
  color: inherit;
}

.colonia-item:hover {
  text-decoration: none;
}`;

if (!cssContent.includes('Enlaces de colonias')) {
  cssContent += coloniaLinkCSS;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('✅ Agregados estilos CSS para enlaces de colonias');
}

console.log('\n🎉 ¡Proceso completado! Todas las colonias ahora son enlaces funcionales.');
console.log(`📄 Páginas creadas: ${colonias.length}`);
console.log('🔗 Enlaces actualizados en index.html');
console.log('🎨 CSS actualizado');
console.log('\n📋 Para probar:');
console.log('1. Abre index.html');  
console.log('2. Ve a la sección "Zonas de Culiacán"');
console.log('3. Haz clic en cualquier colonia');
console.log('4. Te llevará a su página específica con SEO optimizado');