/**
 * Sistema de soporte WebP para ZASA Kitchen Studio
 * Detecta soporte de WebP y carga imágenes optimizadas automáticamente
 */

(function() {
    'use strict';

    // Detectar soporte WebP
    function supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Función para convertir ruta de imagen a WebP
    function getWebPPath(originalPath) {
        // Cambiar extensión a .webp
        return originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    // Verificar si existe el archivo WebP
    async function webpExists(webpPath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = webpPath;
        });
    }

    // Optimizar imagen individual
    async function optimizeImage(img) {
        const originalSrc = img.src || img.dataset.src;
        if (!originalSrc) return;

        // Skip si ya es WebP
        if (originalSrc.includes('.webp')) return;

        const webpPath = getWebPPath(originalSrc);
        
        try {
            const exists = await webpExists(webpPath);
            if (exists) {
                // Crear elemento picture para fallback
                const picture = document.createElement('picture');
                
                // Source WebP
                const sourceWebP = document.createElement('source');
                sourceWebP.srcset = webpPath;
                sourceWebP.type = 'image/webp';
                
                // Clonar imagen original como fallback
                const fallbackImg = img.cloneNode(true);
                
                // Insertar elementos
                picture.appendChild(sourceWebP);
                picture.appendChild(fallbackImg);
                
                // Reemplazar imagen original
                img.parentNode.replaceChild(picture, img);
                
                console.log(`✅ WebP optimizado: ${webpPath}`);
            }
        } catch (error) {
            console.warn(`⚠️ Error al cargar WebP para ${originalSrc}:`, error);
        }
    }

    // Optimizar todas las imágenes en la página
    async function optimizeAllImages() {
        const hasWebPSupport = await supportsWebP();
        
        if (!hasWebPSupport) {
            console.log('ℹ️ WebP no soportado en este navegador');
            return;
        }

        console.log('🚀 Iniciando optimización WebP...');
        
        // Obtener todas las imágenes
        const images = document.querySelectorAll('img[src], img[data-src]');
        
        // Procesar en lotes para no sobrecargar
        const batchSize = 5;
        for (let i = 0; i < images.length; i += batchSize) {
            const batch = Array.from(images).slice(i, i + batchSize);
            await Promise.all(batch.map(optimizeImage));
        }
        
        console.log(`✅ Optimización WebP completada: ${images.length} imágenes procesadas`);
    }

    // Observer para imágenes que se cargan dinámicamente
    function observeNewImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const images = node.tagName === 'IMG' 
                            ? [node] 
                            : node.querySelectorAll ? node.querySelectorAll('img') : [];
                        
                        images.forEach(optimizeImage);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Generar WebP para imagen específica (función utilitaria)
    window.generateWebPVersion = async function(imagePath) {
        const webpPath = getWebPPath(imagePath);
        
        try {
            // Cargar imagen original
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Convertir a WebP (si el navegador lo soporta)
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            console.log(`🎨 WebP generado: ${webpPath}`);
                            resolve(url);
                        } else {
                            reject(new Error('No se pudo generar WebP'));
                        }
                    }, 'image/webp', 0.8);
                };
                img.onerror = reject;
                img.src = imagePath;
            });
        } catch (error) {
            console.error('Error generando WebP:', error);
        }
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeAllImages();
            observeNewImages();
        });
    } else {
        optimizeAllImages();
        observeNewImages();
    }

    // Agregar estilos CSS para picture elements
    const style = document.createElement('style');
    style.textContent = `
        picture {
            display: inline-block;
        }
        picture img {
            display: block;
            max-width: 100%;
            height: auto;
        }
        /* Transición suave para carga de imágenes */
        img, picture img {
            transition: opacity 0.3s ease;
        }
        img[data-webp-loading], picture img[data-webp-loading] {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);

    console.log('🌐 Sistema WebP de ZASA inicializado');

})();