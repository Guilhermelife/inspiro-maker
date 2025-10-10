const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_LOGO = path.join(__dirname, '../public/logo.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');
const SPLASH_DIR = path.join(__dirname, '../public/splash');

// Criar diretórios se não existirem
[ICONS_DIR, SPLASH_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Tamanhos de ícones
const iconSizes = [48, 72, 96, 144, 192, 256, 384, 512];

// Apple Touch Icons
const appleTouchSizes = [120, 152, 180];

// Splash screens iOS
const splashScreens = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' }, // iPad Pro 12.9"
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388.png' }, // iPad Pro 11"
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' }, // iPad Air
  { width: 1170, height: 2532, name: 'apple-splash-1170-2532.png' }, // iPhone 13 Pro
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' }, // iPhone X/11 Pro
  { width: 828, height: 1792, name: 'apple-splash-828-1792.png' },   // iPhone 11
];

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...\n');

  // Ícones padrão
  for (const size of iconSizes) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(SOURCE_LOGO)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    console.log(`✅ Gerado: icon-${size}x${size}.png`);
  }

  // Ícone maskable (com padding de 20% para safe zone)
  const maskableSize = 512;
  const logoSize = Math.floor(maskableSize * 0.6); // Logo ocupa 60% do espaço
  const padding = Math.floor((maskableSize - logoSize) / 2);
  
  await sharp(SOURCE_LOGO)
    .resize(logoSize, logoSize, { fit: 'contain' })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 59, g: 130, b: 246, alpha: 1 } // theme_color
    })
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-maskable-512x512.png'));
  console.log('✅ Gerado: icon-maskable-512x512.png (Android Adaptive)');

  // Apple Touch Icons
  for (const size of appleTouchSizes) {
    const outputPath = path.join(ICONS_DIR, `apple-touch-icon-${size}x${size}.png`);
    await sharp(SOURCE_LOGO)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(outputPath);
    console.log(`✅ Gerado: apple-touch-icon-${size}x${size}.png`);
  }

  // Splash screens iOS
  console.log('\n🎨 Gerando splash screens iOS...\n');
  for (const screen of splashScreens) {
    const { width, height, name } = screen;
    
    // Logo centralizado (30% da altura da tela)
    const logoHeight = Math.floor(height * 0.3);
    
    // Criar canvas branco
    const canvas = sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    });

    // Resize logo
    const resizedLogo = await sharp(SOURCE_LOGO)
      .resize(logoHeight, logoHeight, { fit: 'contain' })
      .toBuffer();

    // Centralizar logo
    const logoX = Math.floor((width - logoHeight) / 2);
    const logoY = Math.floor((height - logoHeight) / 2);

    await canvas
      .composite([{
        input: resizedLogo,
        top: logoY,
        left: logoX
      }])
      .png()
      .toFile(path.join(SPLASH_DIR, name));
    
    console.log(`✅ Gerado: ${name}`);
  }

  console.log('\n🎉 Todos os ícones e splash screens foram gerados com sucesso!');
}

// Executar
generateIcons().catch(err => {
  console.error('❌ Erro ao gerar ícones:', err);
  process.exit(1);
});
