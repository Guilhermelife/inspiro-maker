export interface QuoteImageOptions {
  text: string;
  author: string;
  profilePhotoUrl?: string;
  appName?: string;
}

export const generateQuoteImage = async ({
  text,
  author,
  profilePhotoUrl,
  appName = "Frases do Dia"
}: QuoteImageOptions): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Set canvas size (Instagram square format)
  canvas.width = 1080;
  canvas.height = 1080;
  
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(47, 128, 237, 0.03)');
  gradient.addColorStop(1, 'rgba(47, 128, 237, 0.08)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Quote text
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 56px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap for quote
  const maxWidth = canvas.width - 160;
  const lineHeight = 80;
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
  
  // Draw quote text
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(`"${line.trim()}"`, canvas.width / 2, startY + index * lineHeight);
  });
  
  // Author
  ctx.font = '32px Poppins, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(`— ${author}`, canvas.width / 2, startY + lines.length * lineHeight + 60);
  
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
  
  // App name footer
  ctx.font = '24px Poppins, sans-serif';
  ctx.fillStyle = '#2F80ED';
  ctx.fillText(appName, canvas.width / 2, canvas.height - 80);
  
  // Border
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  
  return canvas.toDataURL('image/png');
};
