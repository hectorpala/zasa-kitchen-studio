const fs = require('fs');
const path = require('path');

// Leer el archivo de componentes
const componentsPath = './components.html';
const components = fs.readFileSync(componentsPath, 'utf8');

// Extraer componentes específicos
const navbarHTML = components.match(/<!-- HEADER\/NAV UNIFICADO -->([\s\S]*?)(?=<!-- HERO SECTION)/)[1];
const footerHTML = components.match(/<!-- FOOTER UNIFICADO -->([\s\S]*?)(?=<!-- JAVASCRIPT)/)[1];
const jsHTML = components.match(/<!-- JAVASCRIPT UNIFICADO -->([\s\S]*?)(?=<!-- CSS ADICIONAL)/)[1];
const cssHTML = components.match(/<!-- CSS ADICIONAL PARA IMAGE SLOTS -->([\s\S]*?)$/)[1];

// Funciones para generar slots de imagen
function createHeroSlot(alt = "Por definir") {
    return `<div class="image-slot hero-image-slot" style="aspect-ratio: 16/9; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; font-size: 14px; border-radius: 12px; margin-bottom: 2rem;">
        <div style="text-align: center;">
            <div style="font-weight: 600; margin-bottom: 4px;">Imagen Hero 16:9</div>
            <div style="font-size: 12px; opacity: 0.8;">${alt} • Lazy loading ready</div>
        </div>
    </div>`;
}

function createCardSlot(alt = "Por definir") {
    return `<div class="image-slot card-image-slot" style="aspect-ratio: 1/1; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; font-size: 12px; border-radius: 8px;">
        <div style="text-align: center;">
            <div style="font-weight: 600; margin-bottom: 2px;">Miniatura 1:1</div>
            <div style="font-size: 10px; opacity: 0.8;">${alt}</div>
        </div>
    </div>`;
}

function createGallerySlot(alt = "Por definir", caption = "") {
    return `<div class="image-slot gallery-image-slot" style="aspect-ratio: 4/3; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; font-size: 13px; border-radius: 10px; margin-bottom: 1rem;">
        <div style="text-align: center;">
            <div style="font-weight: 600; margin-bottom: 4px;">Galería 4:3</div>
            <div style="font-size: 11px; opacity: 0.8;">${alt} • ${caption || 'Lazy loading ready'}</div>
        </div>
    </div>`;
}

// Función para procesar un archivo HTML
function processHTMLFile(filePath) {
    // Procesando archivo
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Unificar header/nav
    if (content.includes('<nav')) {
        content = content.replace(/<nav[\s\S]*?<\/nav>/g, navbarHTML.trim());
    } else if (content.includes('<body>')) {
        content = content.replace('<body>', `<body>${navbarHTML}`);
    }
    
    // 2. Unificar footer
    if (content.includes('<footer')) {
        content = content.replace(/<footer[\s\S]*?<\/footer>/g, footerHTML.trim());
    } else {
        content = content.replace('</body>', `${footerHTML}\n</body>`);
    }
    
    // 3. Agregar JavaScript unificado
    if (!content.includes('hamburger')) {
        content = content.replace('</body>', `${jsHTML}\n</body>`);
    }
    
    // 4. Agregar CSS para image slots
    if (!content.includes('.image-slot')) {
        content = content.replace('</head>', `${cssHTML}\n</head>`);
    }
    
    // 5. Detectar y reemplazar secciones que necesitan imágenes
    const fileName = path.basename(filePath, '.html');
    
    // Hero sections
    if (content.includes('<header') && content.includes('hero')) {
        // Si no tiene imagen hero, agregar slot
        if (!content.includes('hero-image-slot')) {
            content = content.replace(/(<header[^>]*class="[^"]*hero[^"]*"[^>]*>)/, 
                `$1\n    ${createHeroSlot(`Hero ${fileName}`)}\n    <div class="hero-overlay">`);
            content = content.replace('</header>', '\n    </div>\n</header>');
        }
    }
    
    // Secciones de servicios - agregar slots de imagen 1:1
    if (content.includes('service-card') && filePath.includes('/servicios/')) {
        // Buscar service-cards sin imágenes y agregar slots
        content = content.replace(/(<div class="service-card"[^>]*>)(\s*)(<h3)/g, 
            `$1$2${createCardSlot(`Servicio ${fileName}`)}$2$3`);
        content = content.replace(/(<a[^>]*class="[^"]*service-card[^"]*"[^>]*>)(\s*)(<div class="service-content">)/g, 
            `$1$2${createCardSlot(`Servicio ${fileName}`)}$2$3`);
    }
    
    // Secciones de proyectos - agregar slots de galería 4:3
    if (filePath.includes('/proyectos/')) {
        // Agregar slots de galería en páginas de proyectos
        const gallerySlots = [
            createGallerySlot(`Proyecto ${fileName} - Antes`, 'Estado inicial'),
            createGallerySlot(`Proyecto ${fileName} - Proceso`, 'Durante instalación'),
            createGallerySlot(`Proyecto ${fileName} - Después`, 'Resultado final')
        ].join('\n');
        
        if (content.includes('<main>') && !content.includes('gallery-image-slot')) {
            content = content.replace(/(<main>[\s\S]*?<section[^>]*>[\s\S]*?<\/section>)/, 
                `$1\n\n        <section class="gallery">\n            <div class="container">\n                <h2>Galería del proyecto</h2>\n                <div class="gallery-grid">\n${gallerySlots}\n                </div>\n            </div>\n        </section>`);
        }
    }
    
    // Secciones de colonias - agregar slots de ejemplo 4:3
    if (filePath.includes('/colonias/')) {
        if (!content.includes('gallery-image-slot')) {
            const exampleSlots = [
                createGallerySlot(`Cocina ${fileName} - Ejemplo 1`, 'Diseño moderno'),
                createGallerySlot(`Cocina ${fileName} - Ejemplo 2`, 'Acabados premium')
            ].join('\n');
            
            content = content.replace(/(<main>[\s\S]*?<section[^>]*>[\s\S]*?<\/section>)/, 
                `$1\n\n        <section class="examples">\n            <div class="container">\n                <h2>Ejemplos en ${fileName}</h2>\n                <div class="examples-grid">\n${exampleSlots}\n                </div>\n            </div>\n        </section>`);
        }
    }
    
    // 6. Asegurar estructura responsive consistente
    if (!content.includes('padding-top: 80px')) {
        content = content.replace('</head>', `\n<style>body { padding-top: 80px; }</style>\n</head>`);
    }
    
    // 7. Asegurar enlaces a CSS y scripts consistentes
    if (!content.includes('style.css')) {
        content = content.replace('</head>', `\n<link rel="stylesheet" href="/style.css">\n</head>`);
    }
    
    if (!content.includes('lazy-loading.js')) {
        content = content.replace('</body>', `\n<script src="/lazy-loading.js"></script>\n</body>`);
    }
    
    // Escribir archivo actualizado
    fs.writeFileSync(filePath, content, 'utf8');
    // Archivo actualizado
}

// Función para encontrar todos los archivos HTML
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Excluir directorios específicos
            if (!file.startsWith('.') && !file.includes('backup') && !file.includes('node_modules')) {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html') && file !== 'index.html' && file !== 'components.html') {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Ejecutar el proceso
// Iniciando unificación de diseño

const htmlFiles = findHTMLFiles('.');
// Archivos HTML encontrados para procesar

let processedFiles = 0;
let errorFiles = [];

htmlFiles.forEach(filePath => {
    try {
        processHTMLFile(filePath);
        processedFiles++;
    } catch (error) {
        // Error procesando archivo
        errorFiles.push(filePath);
    }
});

// Resumen de unificación
// Archivos procesados exitosamente
// Archivos con errores

if (errorFiles.length > 0) {
    // Archivos con errores:
    // Lista de archivos con errores
}

console.log('\n🎉 Unificación de diseño completada!');
console.log('\n📝 Cambios realizados:');
console.log('  • Header/Nav unificado con logo y menú hamburguesa');
console.log('  • Footer unificado con información de contacto');
console.log('  • JavaScript unificado para interacciones');
console.log('  • Slots de imagen añadidos con ratios correctos:');
console.log('    - Hero: 16:9');
console.log('    - Tarjetas: 1:1');
console.log('    - Galerías: 4:3');
console.log('  • CSS responsive consistente');
console.log('  • Preparación para lazy loading');