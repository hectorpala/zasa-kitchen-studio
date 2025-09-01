#!/usr/bin/env python3
"""
Script para aplicar optimizaciones de rendimiento a páginas HTML restantes
Aplica las mismas optimizaciones ya implementadas en las páginas de ejemplo
"""

import os
import re
import subprocess
from pathlib import Path

def get_unoptimized_pages():
    """Encuentra páginas que no tienen loading='lazy' (indicador de optimización faltante)"""
    try:
        # Usar grep para encontrar archivos sin loading="lazy"
        result = subprocess.run([
            'find', '.', '-name', '*.html', 
            '-not', '-path', './node_modules/*',
            '-exec', 'grep', '-L', 'loading="lazy"', '{}', ';'
        ], capture_output=True, text=True, cwd='.')
        
        pages = [p.strip() for p in result.stdout.strip().split('\n') if p.strip()]
        return pages
    except:
        return []

def add_gtm_script(content):
    """Añade Google Tag Manager al head si no existe"""
    if 'Google Tag Manager' in content:
        return content
    
    gtm_script = '''<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5JP92QFH');</script>
<!-- End Google Tag Manager -->

'''
    
    # Insertar después del <head>
    content = content.replace('<head>', f'<head>\n{gtm_script}', 1)
    return content

def add_image_optimizations(content):
    """Añade width, height, loading y decoding a imágenes"""
    # Hero images get fetchpriority="high"
    hero_pattern = r'<img([^>]*)(src="[^"]*(?:hero|banner|main)[^"]*")([^>]*)>'
    def hero_replacer(match):
        attrs = match.group(1) + match.group(2) + match.group(3)
        if 'fetchpriority=' not in attrs:
            attrs += ' fetchpriority="high"'
        if 'decoding=' not in attrs:
            attrs += ' decoding="async"'
        if 'width=' not in attrs:
            attrs += ' width="1200"'
        if 'height=' not in attrs:
            attrs += ' height="600"'
        return f'<img{attrs}>'
    
    content = re.sub(hero_pattern, hero_replacer, content, flags=re.IGNORECASE)
    
    # Regular images get lazy loading
    img_pattern = r'<img([^>]*src="[^"]*")([^>]*)>'
    def img_replacer(match):
        attrs = match.group(1) + match.group(2)
        if 'loading=' not in attrs and 'fetchpriority=' not in attrs:
            attrs += ' loading="lazy"'
        if 'decoding=' not in attrs:
            attrs += ' decoding="async"'
        if 'width=' not in attrs:
            attrs += ' width="400"'
        if 'height=' not in attrs:
            attrs += ' height="300"'
        return f'<img{attrs}>'
    
    content = re.sub(img_pattern, img_replacer, content, flags=re.IGNORECASE)
    return content

def add_font_optimizations(content):
    """Añade preload de fuentes y font-display: swap"""
    if 'preload' not in content or 'font' not in content:
        preload_fonts = '''  
  <!-- Preload recursos críticos optimizado -->
  <link rel="preload" as="image" href="../assets/hero/cocinamodernanuevo-hero.png" fetchpriority="high">
  <link rel="preload" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2" as="font" type="font/woff2" crossorigin>
'''
        # Insertar antes de </head>
        content = content.replace('</head>', f'{preload_fonts}\n</head>')
    
    # Asegurar font-display: swap en fuentes de Google
    google_fonts_pattern = r'(https://fonts\.googleapis\.com/css2[^"]*)'
    def font_replacer(match):
        url = match.group(1)
        if 'display=swap' not in url:
            separator = '&' if '?' in url else '?'
            url += f'{separator}display=swap'
        return url
    
    content = re.sub(google_fonts_pattern, font_replacer, content)
    return content

def add_critical_css(content):
    """Añade CSS crítico inline si no existe"""
    if 'Critical CSS inline' in content:
        return content
    
    critical_css = '''  
  <!-- Critical CSS inline -->
  <style>
    *{margin:0;padding:0;box-sizing:border-box}:root{--brand:#E36414;--brand-light:#F97316;--text:#0F172A;--bg:#FFFFFF;--bg-soft:#F8FAFC;--border:#E2E8F0;--gradient-brand:linear-gradient(135deg,#F97316 0%,#E36414 100%)}body{font-family:'Inter',sans-serif;font-display:swap;line-height:1.7;color:var(--text);background:var(--bg-soft);padding-top:80px}.fonts-loading body{opacity:0.9}.fonts-loaded body{opacity:1;transition:opacity 0.3s}.navbar{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:16px 0;will-change:transform}.container{max-width:1200px;margin:0 auto;padding:0 24px}.nav-wrap{display:flex;align-items:center;justify-content:space-between}.logo-navbar{height:65px;width:auto;display:block}.nav-list{display:flex;gap:24px;list-style:none;margin:0}.hero{min-height:85vh;display:grid;place-items:center;text-align:center;position:relative;contain:layout}.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(15,23,42,0.4) 0%,rgba(30,41,59,0.3) 100%)}@media (max-width:640px){.hero::after{background:linear-gradient(135deg,rgba(15,23,42,0.6) 0%,rgba(30,41,59,0.5) 100%)!important}}.hero .container{position:relative;z-index:1}.lazyload{transition:opacity 0.3s;opacity:0}.lazyloaded{opacity:1}
  .skip-link{position:absolute;left:-999px;top:auto}.skip-link:focus{left:16px;top:16px;z-index:1000;background:#000;color:#fff;padding:.5rem .75rem;border-radius:.5rem}</style>
'''
    
    # Insertar antes de </head>
    content = content.replace('</head>', f'{critical_css}\n</head>')
    return content

def add_script_defer(content):
    """Añade defer a scripts externos"""
    script_pattern = r'<script([^>]*src="[^"]*")([^>]*)></script>'
    def script_replacer(match):
        attrs = match.group(1) + match.group(2)
        if 'defer' not in attrs and 'async' not in attrs and 'gtm' not in attrs.lower():
            attrs += ' defer'
        return f'<script{attrs}></script>'
    
    content = re.sub(script_pattern, script_replacer, content)
    return content

def optimize_html_file(file_path):
    """Optimiza un archivo HTML individual"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Aplicar optimizaciones
        content = add_gtm_script(content)
        content = add_image_optimizations(content)
        content = add_font_optimizations(content)
        content = add_critical_css(content)
        content = add_script_defer(content)
        
        # Solo escribir si hay cambios
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error optimizando {file_path}: {e}")
        return False

def main():
    """Función principal"""
    print("🔍 Buscando páginas sin optimizar...")
    unoptimized_pages = get_unoptimized_pages()
    
    if not unoptimized_pages:
        print("✅ Todas las páginas ya están optimizadas")
        return
    
    print(f"📋 Encontradas {len(unoptimized_pages)} páginas para optimizar:")
    for page in unoptimized_pages[:10]:  # Mostrar solo las primeras 10
        print(f"  • {page}")
    if len(unoptimized_pages) > 10:
        print(f"  ... y {len(unoptimized_pages) - 10} más")
    
    print("\n🚀 Iniciando optimizaciones...")
    optimized_count = 0
    
    for page in unoptimized_pages:
        if optimize_html_file(page):
            optimized_count += 1
            print(f"✅ Optimizado: {page}")
        else:
            print(f"⚠️  Sin cambios: {page}")
    
    print(f"\n🎉 Proceso completado!")
    print(f"📊 Páginas optimizadas: {optimized_count}/{len(unoptimized_pages)}")

if __name__ == "__main__":
    main()