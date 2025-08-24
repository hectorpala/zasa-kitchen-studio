const fs = require('fs');
const path = require('path');

// Script para corregir problemas de estructura en el nav
function fixNavStructure(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Detectar y corregir divs extra en navbar
        const navRegex = /<nav class="navbar">([\s\S]*?)<\/nav>/g;
        const match = content.match(navRegex);
        
        if (match) {
            let navContent = match[0];
            
            // Corregir divs duplicados o mal estructurados
            navContent = navContent.replace(/<div class="brand">\s*<img[^>]*>\s*<\/div>\s*<\/div>\s*<\/div>/g, 
                `<div class="brand">
                <img src="/img/logo-zasa.jpg" alt="Zasa Kitchen Studio" class="logo-navbar">
            </div>`);
            
            // Reconstruir nav correctamente
            const cleanNav = `<nav class="navbar">
        <div class="container nav-wrap">
            <div class="brand">
                <img src="/img/logo-zasa.jpg" alt="Zasa Kitchen Studio" class="logo-navbar">
            </div>
            <ul class='nav-list' id="nav-list">
              <li class='nav-item'>
                <a href='/servicios' class='nav-link'>SERVICIOS</a>
              </li>
              <li class='nav-item'>
                <a href='/proyectos-culiacan' class='nav-link'>PROYECTOS</a>
              </li>
              <li class='nav-item'>
                <a href='/blog' class='nav-link'>BLOG</a>
              </li>
              <li class='nav-item'>
                <a href='/contacto/?utm_source=site&utm_medium=nav&utm_campaign=contacto' class='nav-link'>CONTACTO</a>
              </li>
            </ul>
            <div class="nav-actions">
              <a href='tel:+526671234567' class='nav-cta' data-phone='header'>
                <span>LLÁMANOS</span>
              </a>
              <button class="hamburger" id="hamburger" aria-label="Menú">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
        </div>
    </nav>`;
            
            content = content.replace(navRegex, cleanNav);
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ Estructura nav corregida: ${filePath}`);
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error(`❌ Error corrigiendo nav en ${filePath}:`, error.message);
        return false;
    }
}

// Función recursiva para encontrar archivos HTML
function findHTMLFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            files.push(...findHTMLFiles(fullPath));
        } else if (item.endsWith('.html') && item !== 'home-template.html') {
            files.push(fullPath);
        }
    }
    
    return files;
}

console.log('🔧 CORRIGIENDO ESTRUCTURA DE NAVEGACIÓN\n');

const htmlFiles = findHTMLFiles('.');
let fixedCount = 0;

for (const file of htmlFiles) {
    if (fixNavStructure(file)) {
        fixedCount++;
    }
}

console.log(`\n✨ CORRECCIÓN COMPLETADA`);
console.log(`📊 Archivos corregidos: ${fixedCount}/${htmlFiles.length}`);