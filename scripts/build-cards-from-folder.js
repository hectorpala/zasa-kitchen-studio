#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const INPUT_FOLDER = path.join(__dirname, '../../Fotos/interior zasa');
const OUTPUT_FOLDER = path.join(__dirname, '../img/optimized/servicios');
const INDEX_HTML_PATH = path.join(__dirname, '../index.html');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];
const SIZES = [480, 800, 1200];
const ASPECT_RATIO = { width: 3, height: 2 }; // 3:2 ratio

/**
 * Convert filename to Title Case
 * @param {string} filename 
 * @returns {string}
 */
function toTitleCase(filename) {
  const slug = path.parse(filename).name;
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

/**
 * Generate slug from filename
 * @param {string} filename 
 * @returns {string}
 */
function generateSlug(filename) {
  return path.parse(filename).name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

/**
 * Optimize image with Sharp
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {number} width 
 * @param {string} format 
 * @returns {Promise<void>}
 */
async function optimizeImage(inputPath, outputPath, width, format = 'jpeg') {
  try {
    const height = Math.round(width * ASPECT_RATIO.height / ASPECT_RATIO.width);
    
    let sharpInstance = sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'attention'
      });

    if (format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: 74, mozjpeg: true });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: 75, effort: 6 });
    }

    await sharpInstance.toFile(outputPath);
    
    // Check file size
    const stats = fs.statSync(outputPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`✓ Generated ${path.basename(outputPath)} (${sizeKB} KB)`);
    
    if (sizeKB > 200) {
      console.warn(`⚠️  Warning: ${path.basename(outputPath)} is ${sizeKB} KB (>200 KB)`);
    }
  } catch (error) {
    console.error(`✗ Error optimizing ${outputPath}:`, error.message);
  }
}

/**
 * Process single image file
 * @param {string} inputPath 
 * @param {string} filename 
 * @returns {Promise<Object|null>}
 */
async function processImage(inputPath, filename) {
  const slug = generateSlug(filename);
  const title = toTitleCase(filename);
  const text = "Diseños personalizados con acabados premium.";
  const href = `${slug}.html`;
  const alt = title;

  console.log(`\nProcessing: ${filename} → ${slug}`);

  try {
    // Generate all sizes and formats
    for (const size of SIZES) {
      // JPEG
      const jpegOutput = path.join(OUTPUT_FOLDER, `${slug}-${size}.jpg`);
      await optimizeImage(inputPath, jpegOutput, size, 'jpeg');

      // WebP
      const webpOutput = path.join(OUTPUT_FOLDER, `${slug}-${size}.webp`);
      await optimizeImage(inputPath, webpOutput, size, 'webp');
    }

    return {
      slug,
      title,
      text,
      href,
      alt
    };
  } catch (error) {
    console.error(`✗ Failed to process ${filename}:`, error.message);
    return null;
  }
}

/**
 * Generate HTML for service card
 * @param {Object} card 
 * @returns {string}
 */
function generateCardHTML(card) {
  const { slug, title, text, href, alt } = card;
  
  return `<div class="service-card" data-card-id="${slug}">
  <img
    src="img/optimized/servicios/${slug}-800.jpg"
    srcset="img/optimized/servicios/${slug}-480.jpg 480w,
            img/optimized/servicios/${slug}-800.jpg 800w,
            img/optimized/servicios/${slug}-1200.jpg 1200w"
    sizes="(max-width: 768px) 100vw, 33vw"
    alt="${alt}"
    width="1200" height="800"
    loading="lazy">
  <h3>${title}</h3>
  <p>${text}</p>
  <a href="${href}" class="btn btn-primary">Ver más</a>
</div>`;
}

/**
 * Skip HTML update - only optimize images
 * @param {Array} cards 
 */
function updateIndexHTML(cards) {
  // DISABLED: Script now only optimizes images, does not modify HTML
  console.log('📝 HTML update skipped - script in image-only mode');
  console.log('📋 Generated optimizations for:');
  cards.forEach(card => {
    console.log(`   ✔ ${card.slug} → 6 files (JPG + WebP in 480, 800, 1200px)`);
  });
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Building service cards from folder...');
  console.log(`📂 Input folder: ${INPUT_FOLDER}`);
  console.log(`📤 Output folder: ${OUTPUT_FOLDER}`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_FOLDER}`);
  }

  // Check if input folder exists
  if (!fs.existsSync(INPUT_FOLDER)) {
    console.error(`✗ Input folder not found: ${INPUT_FOLDER}`);
    process.exit(1);
  }

  // Read all files from input folder
  const files = fs.readdirSync(INPUT_FOLDER)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext) && !file.startsWith('.DS_Store');
    });

  if (files.length === 0) {
    console.warn('⚠️  No supported image files found in input folder');
    console.log(`Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
    return;
  }

  console.log(`📸 Found ${files.length} images to process`);

  // Process all images
  const cards = [];
  for (const filename of files) {
    const inputPath = path.join(INPUT_FOLDER, filename);
    const cardData = await processImage(inputPath, filename);
    
    if (cardData) {
      cards.push(cardData);
    }
  }

  if (cards.length === 0) {
    console.error('✗ No cards were successfully generated');
    return;
  }

  console.log(`\n✅ Successfully processed ${cards.length} images`);
  
  // Skip HTML update - only optimize images
  updateIndexHTML(cards);
  
  console.log('\n🎉 Image optimization complete!');
  console.log('📋 Summary:');
  cards.forEach(card => {
    console.log(`   - ${card.title} (${card.slug})`);
  });
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}