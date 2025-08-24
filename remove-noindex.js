const fs = require('fs');
const path = require('path');

// Script para remover meta robots noindex de todos los HTML
function getAllHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
            getAllHtmlFiles(fullPath, files);
        } else if (stat.isFile() && item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

function removeNoindex() {
    console.log('🔍 Buscando archivos HTML con noindex...');
    
    const htmlFiles = getAllHtmlFiles('.');
    let processedCount = 0;
    
    htmlFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si tiene la línea noindex
        if (content.includes('<meta name="robots" content="noindex, nofollow">')) {
            console.log(`📝 Removiendo noindex de: ${filePath}`);
            
            // Remover la línea completa del meta robots
            const updatedContent = content.replace(
                /\s*<meta name="robots" content="noindex, nofollow">\n?/g, 
                ''
            );
            
            fs.writeFileSync(filePath, updatedContent);
            processedCount++;
        }
    });
    
    console.log(`✅ Proceso completado. ${processedCount} archivos actualizados`);
    console.log('🚀 Archivos listos para producción (sin restricciones de indexación)');
}

removeNoindex();