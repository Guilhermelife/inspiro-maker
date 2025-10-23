export type ImageFormat = 'instagram-square' | 'instagram-portrait' | 'instagram-story' | 'facebook' | 'twitter';

export interface QuoteImageOptions {
  text: string;
  author: string;
  category?: string;
  profilePhotoUrl?: string;
  appName?: string;
  format?: ImageFormat;
}

const FORMAT_SIZES: Record<ImageFormat, { width: number; height: number }> = {
  'instagram-square': { width: 1080, height: 1080 },
  'instagram-portrait': { width: 1080, height: 1350 },
  'instagram-story': { width: 1080, height: 1920 },
  'facebook': { width: 1200, height: 630 },
  'twitter': { width: 1200, height: 675 },
};

export const generateQuoteImage = async ({
  text,
  author,
  category = 'aleatoria',
  profilePhotoUrl,
  appName = "Frases do Dia",
  format = 'instagram-square'
}: QuoteImageOptions): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Set canvas size based on format
  const { width, height } = FORMAT_SIZES[format];
  canvas.width = width;
  canvas.height = height;
  
  // Calculate proportional sizes
  const isVertical = height > width;
  const isStory = format === 'instagram-story';
  const aspectRatio = width / height;
  
  // Category-based gradients
  const categoryGradients: Record<string, { start: string; end: string }> = {
    motivacional: { start: 'rgba(249, 115, 22, 0.15)', end: 'rgba(239, 68, 68, 0.15)' },
    reflexiva: { start: 'rgba(168, 85, 247, 0.15)', end: 'rgba(59, 130, 246, 0.15)' },
    biblica: { start: 'rgba(245, 158, 11, 0.15)', end: 'rgba(234, 179, 8, 0.15)' },
    amor: { start: 'rgba(236, 72, 153, 0.15)', end: 'rgba(244, 63, 94, 0.15)' },
    'motivacao-reversa': { start: 'rgba(239, 68, 68, 0.15)', end: 'rgba(107, 114, 128, 0.15)' },
    aleatoria: { start: 'rgba(59, 130, 246, 0.15)', end: 'rgba(6, 182, 212, 0.15)' },
  };
  
  const colors = categoryGradients[category] || categoryGradients.aleatoria;
  
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add gradient overlay based on category
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colors.start);
  gradient.addColorStop(1, colors.end);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Decorative quotes (scaled by format)
  const decorativeSize = isStory ? 180 : isVertical ? 140 : 120;
  const decorativePadding = width * 0.05;
  ctx.font = `${decorativeSize}px Georgia, serif`;
  ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
  ctx.textAlign = 'left';
  ctx.fillText('"', decorativePadding, decorativeSize);
  ctx.textAlign = 'right';
  ctx.fillText('"', canvas.width - decorativePadding, canvas.height - decorativePadding);
  
  // Quote text with Playfair Display (serif) - scaled by format
  const fontSize = isStory ? 72 : isVertical ? 56 : 48;
  const lineHeight = fontSize * 1.5;
  const padding = width * 0.1;
  const maxWidth = width - (padding * 2);
  
  ctx.fillStyle = '#1F2937';
  ctx.font = `600 ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine);
  
  // Draw quote text centered (adjusted for format)
  const verticalOffset = isStory ? -100 : isVertical ? 0 : 20;
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2 + verticalOffset;
  lines.forEach((line, index) => {
    ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
  });
  
  // Decorative divider (scaled)
  const dividerLength = isStory ? 150 : isVertical ? 120 : 100;
  const dividerY = startY + lines.length * lineHeight + (isStory ? 60 : 40);
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - dividerLength, dividerY);
  ctx.lineTo(canvas.width / 2 + dividerLength, dividerY);
  ctx.stroke();
  
  // Author (scaled)
  const authorSize = isStory ? 36 : isVertical ? 32 : 28;
  ctx.font = `${authorSize}px Georgia, serif`;
  ctx.fillStyle = '#6B7280';
  ctx.fillText(`— ${author}`, canvas.width / 2, dividerY + (isStory ? 55 : 45));
  
  // Profile photo (if provided)
  if (profilePhotoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profilePhotoUrl;
      });
      
      // Draw circular profile photo
      const photoSize = 100;
      const photoX = canvas.width / 2;
      const photoY = canvas.height - 200;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, photoX - photoSize / 2, photoY - photoSize / 2, photoSize, photoSize);
      ctx.restore();
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
  }
  
  // App name footer with watermark (scaled)
  const footerSize = isStory ? 28 : isVertical ? 24 : 20;
  const footerPadding = isStory ? 60 : 40;
  ctx.font = `${footerSize}px sans-serif`;
  ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
  ctx.fillText(appName, canvas.width / 2, canvas.height - footerPadding);
  
  // Subtle border
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
  
  return canvas.toDataURL('image/png');
};
