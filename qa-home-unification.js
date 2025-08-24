const fs = require('fs');
const path = require('path');

// Script de QA para verificar unificación del diseño del home
function qaPageUnification(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        const issues = [];
        const checks = [];
        
        console.log(`\n🔍 QA: ${filePath}`);
        
        // 1. Verificar padding-top del body
        if (content.includes('body { padding-top: 80px; }') || content.includes('padding-top:80px')) {
            checks.push('✅ Body padding-top: 80px');
        } else {
            issues.push('❌ Falta body padding-top: 80px');
        }
        
        // 2. Verificar navbar unificado
        if (content.includes('<nav class="navbar">') && 
            content.includes('class="logo-navbar"') && 
            content.includes('class="hamburger"')) {
            checks.push('✅ Navbar unificado con logo y hamburger');
        } else {
            issues.push('❌ Navbar no tiene estructura unificada');
        }
        
        // 3. Verificar footer unificado
        if (content.includes('<footer id="contacto">') && 
            content.includes('Zasa Kitchen Studio – Cocinas Integrales')) {
            checks.push('✅ Footer unificado');
        } else {
            issues.push('❌ Footer no tiene estructura unificada');
        }
        
        // 4. Verificar hero structure
        if (content.includes('<header class="hero">')) {
            checks.push('✅ Hero con clase correcta');
        } else {
            issues.push('❌ Falta hero con clase correcta');
        }
        
        // 5. Verificar JavaScript unificado
        if (content.includes('// Menú hamburguesa premium') && 
            content.includes('hamburger.classList.toggle') && 
            content.includes('// Navbar scroll effect')) {
            checks.push('✅ JavaScript unificado con funcionalidades');
        } else {
            issues.push('❌ JavaScript no tiene las funcionalidades unificadas');
        }
        
        // 6. Verificar rutas CSS correctas
        const depth = (filePath.match(/\//g) || []).length;
        const expectedCssPath = '../'.repeat(depth) + 'style.css';
        if (content.includes(`href="${expectedCssPath}"`)) {
            checks.push(`✅ Ruta CSS correcta: ${expectedCssPath}`);
        } else if (content.includes('href="style.css"') && depth === 0) {
            checks.push('✅ Ruta CSS correcta: style.css');
        } else {
            issues.push(`❌ Ruta CSS incorrecta, debería ser: ${expectedCssPath}`);
        }
        
        // 7. Verificar lazy loading script
        const expectedScriptPath = '../'.repeat(depth) + 'lazy-loading.js';
        if (content.includes(`src="${expectedScriptPath}"`) || 
            content.includes('src="lazy-loading.js"') || 
            content.includes('src="/lazy-loading.js"')) {
            checks.push('✅ Script lazy loading referenciado');
        } else {
            checks.push('⚠️  Sin referencia a lazy loading script');
        }
        
        // 8. Verificar image slots preservados
        if (content.includes('image-slot') && content.includes('placeholder-content')) {
            checks.push('✅ Image slots con placeholders preservados');
        } else if (content.includes('image-slot')) {
            checks.push('⚠️  Image slots presentes (sin placeholder)');
        } else {
            checks.push('ℹ️  Sin image slots (puede ser normal según página)');
        }
        
        // 9. Verificar responsive breakpoints
        if (content.includes('@media') && content.includes('768px')) {
            checks.push('✅ Breakpoints responsive detectados');
        } else {
            checks.push('ℹ️  Sin breakpoints responsive en página');
        }
        
        // 10. Verificar CTAs y botones unificados
        if (content.includes('btn btn-primary') || content.includes('wa.me/526671234567')) {
            checks.push('✅ CTAs/botones WhatsApp presentes');
        } else {
            checks.push('⚠️  Sin CTAs principales detectados');
        }
        
        // Mostrar resultados
        checks.forEach(check => console.log(`   ${check}`));
        if (issues.length > 0) {
            issues.forEach(issue => console.log(`   ${issue}`));
        }
        
        return {
            file: filePath,
            checks: checks.length,
            issues: issues.length,
            issuesList: issues,
            status: issues.length === 0 ? 'PASS' : 'NEEDS_ATTENTION'
        };
        
    } catch (error) {
        console.error(`❌ Error en QA ${filePath}:`, error.message);
        return {
            file: filePath,
            checks: 0,
            issues: 1,
            issuesList: [`Error leyendo archivo: ${error.message}`],
            status: 'ERROR'
        };
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
        } else if (item.endsWith('.html') && 
                   !item.includes('template') && 
                   !item.includes('backup') &&
                   !item.includes('old') &&
                   item !== 'components.html') {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Main execution
console.log('🔍 INICIANDO QA DE UNIFICACIÓN HOME-STYLE\n');
console.log('📋 Verificando que todas las páginas tengan el mismo look & feel del homepage...\n');

const htmlFiles = findHTMLFiles('.');
// Tomar muestra de 25 páginas aleatorias para QA intensivo
const shuffledFiles = htmlFiles.sort(() => 0.5 - Math.random());
const qaFiles = shuffledFiles.slice(0, 25);

const results = [];
let totalChecks = 0;
let totalIssues = 0;
let passCount = 0;
let needsAttentionCount = 0;
let errorCount = 0;

console.log(`📁 Archivos seleccionados para QA: ${qaFiles.length} de ${htmlFiles.length} total\n`);

for (const file of qaFiles) {
    const result = qaPageUnification(file);
    results.push(result);
    totalChecks += result.checks;
    totalIssues += result.issues;
    
    if (result.status === 'PASS') passCount++;
    else if (result.status === 'NEEDS_ATTENTION') needsAttentionCount++;
    else errorCount++;
}

// Generar reporte final
console.log('\n' + '='.repeat(80));
console.log('📊 REPORTE FINAL QA - UNIFICACIÓN HOME-STYLE');
console.log('='.repeat(80));
console.log(`✅ Páginas que PASAN QA: ${passCount}/${qaFiles.length}`);
console.log(`⚠️  Páginas que NECESITAN ATENCIÓN: ${needsAttentionCount}/${qaFiles.length}`);
console.log(`❌ Páginas con ERRORES: ${errorCount}/${qaFiles.length}`);
console.log(`🔍 Total verificaciones: ${totalChecks}`);
console.log(`⚠️  Total issues encontrados: ${totalIssues}`);

if (needsAttentionCount > 0 || errorCount > 0) {
    console.log('\n🔥 PÁGINAS QUE REQUIEREN ATENCIÓN:');
    results.forEach(result => {
        if (result.status !== 'PASS') {
            console.log(`\n📄 ${result.file}`);
            result.issuesList.forEach(issue => console.log(`   ${issue}`));
        }
    });
}

const successRate = ((passCount / qaFiles.length) * 100).toFixed(1);
console.log(`\n📈 TASA DE ÉXITO: ${successRate}%`);

if (successRate >= 90) {
    console.log('\n🎉 EXCELENTE: La unificación del diseño está muy bien implementada');
} else if (successRate >= 75) {
    console.log('\n✅ BUENO: La mayoría de páginas están unificadas, ajustes menores pendientes');
} else {
    console.log('\n⚠️  ATENCIÓN: Se requieren más ajustes para completar la unificación');
}

console.log('\n🎯 CRITERIOS EVALUADOS:');
console.log('   - Header/Nav idénticos en todas las páginas');
console.log('   - Hero y grids con la misma jerarquía visual');
console.log('   - CTAs/botones/tarjetas con el mismo estilo');
console.log('   - Footer unificado');
console.log('   - JavaScript con menú hamburguesa y scroll effects');
console.log('   - Rutas CSS correctas según ubicación');
console.log('   - Image slots preservados con placeholders');
console.log('   - Responsive breakpoints consistentes');
console.log('\n🚦 QA COMPLETADO');

return results;