const fs = require('fs');
const path = require('path');

// Script para corregir páginas que no tienen <header class="hero">
function fixMissingHero(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Si ya tiene hero, no hacer nada
        if (content.includes('<header class="hero">')) {
            return false;
        }
        
        // Buscar patrones comunes donde debería ir el hero
        const patterns = [
            // Después del nav y antes del main
            {
                find: /(<\/nav>[\s]*)([\s\S]*?)(<main)/,
                replace: '$1\n    \n    <header class="hero">\n        <div class="container">\n            <!-- Hero content será definido por cada página -->\n        </div>\n    </header>\n$3'
            },
            // Después del nav y antes de section
            {
                find: /(<\/nav>[\s]*)([\s\S]*?)(<section)/,
                replace: '$1\n    \n    <header class="hero">\n        <div class="container">\n            <!-- Hero content será definido por cada página -->\n        </div>\n    </header>\n\n    $3'
            },
            // Si hay un header diferente, convertirlo
            {
                find: /<header(?![^>]*class="hero")[^>]*>([\s\S]*?)<\/header>/,
                replace: '<header class="hero">\n        <div class="container">\n            $1\n        </div>\n    </header>'
            }
        ];
        
        let modified = false;
        
        for (const pattern of patterns) {
            if (pattern.find.test(content)) {
                content = content.replace(pattern.find, pattern.replace);
                modified = true;
                console.log(`✅ Hero agregado a: ${filePath}`);
                break;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content);
            return true;
        } else {
            console.log(`⚠️  No se pudo agregar hero automáticamente a: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
        return false;
    }
}

// Lista de archivos que necesitan corrección según QA
const filesToFix = [
    'proyectos-culiacan/centro.html',
    'proyectos-culiacan/la-primavera.html',
    'servicios/cocinas/integrales-en-u.html',
    'index-v2.html',
    'proyectos-culiacan/benevento.html',
    'proyectos-culiacan/infonavit-humaya.html',
    'servicios/closets-culiacan.html',
    'servicios/cubiertas/cubiertas-marmol-culiacan.html',
    'proyectos-culiacan/horizontes.html'
];

console.log('🔧 CORRIGIENDO PÁGINAS SIN HERO\n');

let fixedCount = 0;

for (const file of filesToFix) {
    if (fixMissingHero(file)) {
        fixedCount++;
    }
}

console.log(`\n✨ CORRECCIÓN COMPLETADA`);
console.log(`📊 Páginas corregidas: ${fixedCount}/${filesToFix.length}`);