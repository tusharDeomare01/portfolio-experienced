/**
 * ID Card Canvas Generator
 * Creates a minimalist vertical ID card matching the screenshot design
 * Also generates lanyard ribbon texture with repeating favicon pattern
 */

/**
 * Loads an image from URL and returns a Promise that resolves with the Image element
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Generates a lanyard ribbon texture with repeating favicon pattern
 * Black background with white favicon icons repeating vertically
 */
export async function generateLanyardTexture(
  faviconUrl: string = '/favicon.svg',
  width: number = 256,
  height: number = 2048
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2D context from canvas');
  }

  // Pure black background for lanyard
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Load favicon
  try {
    const faviconImg = await loadImage(faviconUrl);
    
    // Calculate icon size - MUCH LARGER for clear visibility
    const iconSize = Math.min(width * 0.6, 80); // 60% of width or max 80px - MUCH LARGER
    const spacing = iconSize * 1.8; // Tighter spacing for more visible pattern
    const iconAspectRatio = faviconImg.width / faviconImg.height;
    const iconWidth = iconSize;
    const iconHeight = iconSize / iconAspectRatio;
    
    // Center icons horizontally
    const iconX = (width - iconWidth) / 2;
    
    // Draw repeating pattern vertically - BRIGHT WHITE icons on black
    let currentY = spacing * 0.5;
    while (currentY < height) {
      ctx.save();
      // Fill with pure white first for better visibility
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(iconX - 2, currentY - iconHeight / 2 - 2, iconWidth + 4, iconHeight + 4);
      
      // Draw icon in white (inverted)
      ctx.filter = 'brightness(0) invert(1)'; // Convert to white
      ctx.drawImage(
        faviconImg, 
        iconX, 
        currentY - iconHeight / 2, 
        iconWidth, 
        iconHeight
      );
      ctx.restore();
      
      currentY += spacing;
    }
  } catch (error) {
    console.warn('Failed to load favicon for lanyard:', error);
    // Fallback: draw LARGE white circles if favicon fails
    const circleSize = width * 0.35; // Much larger fallback
    const spacing = circleSize * 2;
    let currentY = spacing;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    while (currentY < height) {
      ctx.beginPath();
      ctx.arc(width / 2, currentY, circleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      currentY += spacing;
    }
  }

  return canvas;
}

interface IDCardOptions {
  width?: number;
  height?: number;
  faviconUrl?: string;
  name?: string;
  title?: string;
  contact?: {
    phone?: string;
    email?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1440; // 1.6:2.25 aspect ratio

/**
 * Generates a canvas texture for the ID card matching the screenshot
 * Large centered atom/favicon icon, visible text below
 */
export async function generateIDCardCanvas(options: IDCardOptions = {}): Promise<HTMLCanvasElement> {
  const {
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    faviconUrl = '/favicon.svg',
    name = 'Tushar Deomare',
    title = 'Software Engineer',
    contact = {
      phone: '+91 95275 57455',
      email: 'tdeomare1@gmail.com',
      linkedin: 'linkedin.com/in/tushar-deomare-04a34819b',
      portfolio: 'tushar-deomare-portfolio.vercel.app'
    }
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2D context from canvas');
  }

  // Set up high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Card background - pure white with subtle texture
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Add very subtle texture
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 1; // Subtle noise
    data[i] = Math.min(255, Math.max(0, data[i] + noise * 0.3)); // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.3)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.3)); // B
  }
  ctx.putImageData(imageData, 0, 0);

  // Padding
  const padding = width * 0.08;
  let currentY = padding * 1.5;

  // Punch hole at top center - black circle
  const holeRadius = width * 0.015;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(width / 2, padding * 0.8, holeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Load and draw LARGE centered favicon/atom icon
  try {
    const faviconImg = await loadImage(faviconUrl);
    
    // Large icon size - prominent in center like screenshot, but leave more room for text
    const iconSize = Math.min(width * 0.45, height * 0.28); // Slightly smaller to leave room for text
    const iconAspectRatio = faviconImg.width / faviconImg.height;
    const iconWidth = iconSize;
    const iconHeight = iconSize / iconAspectRatio;
    
    // Center icon horizontally and vertically in upper portion
    const iconX = (width - iconWidth) / 2;
    const iconY = currentY; // Start from current position
    
    // Draw black favicon icon - ensure it's properly rendered
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    
    // First, ensure we have a clean black background for the icon area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(iconX - 5, iconY - 5, iconWidth + 10, iconHeight + 10);
    
    // Draw the icon in black
    ctx.filter = 'brightness(0)'; // Make it pure black
    ctx.drawImage(faviconImg, iconX, iconY, iconWidth, iconHeight);
    ctx.filter = 'none'; // Reset filter
    ctx.restore();
    
    // Update currentY to below the icon with good spacing
    currentY = iconY + iconHeight + padding * 2;
  } catch (error) {
    console.warn('Failed to load favicon for ID card:', error);
    // Draw a fallback atom-like icon if favicon fails
    const fallbackSize = Math.min(width * 0.4, height * 0.25);
    // const fallbackX = (width - fallbackSize) / 2;
    const fallbackY = currentY;
    
    // Draw a simple atom icon as fallback
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = width * 0.01;
    
    // Draw atom-like circles
    const centerX = width / 2;
    const centerY = fallbackY + fallbackSize / 2;
    const radius = fallbackSize * 0.15;
    
    // Three orbital rings
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 1.5, radius * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 1.5, radius * 0.5, Math.PI / 3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 1.5, radius * 0.5, -Math.PI / 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center nucleus
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    currentY = fallbackY + fallbackSize + padding * 2;
  }

  // Name - PRODUCTION READY: VERY LARGE and BOLD
  const nameFontSize = Math.max(Math.min(width * 0.09, 80), 56); // 9% width, max 80px, min 56px - PRODUCTION SIZE
  ctx.fillStyle = '#000000'; // Pure black
  ctx.font = `bold ${nameFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(name, width / 2, currentY);
  currentY += nameFontSize * 1.6 + padding * 1;

  // Title - PRODUCTION READY: CLEARLY VISIBLE
  const titleFontSize = Math.max(Math.min(width * 0.04, 36), 26); // 4% width, max 36px, min 26px - PRODUCTION SIZE
  ctx.fillStyle = '#000000'; // Pure black, not gray - maximum contrast
  ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`;
  ctx.fillText(title, width / 2, currentY);
  currentY += titleFontSize * 2.2 + padding * 2;

  // Divider line - more visible
  ctx.strokeStyle = '#999999'; // Darker divider
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding * 1.5, currentY);
  ctx.lineTo(width - padding * 1.5, currentY);
  ctx.stroke();
  currentY += padding * 2;

  // Contact information - PRODUCTION READY: MUCH LARGER AND CLEARLY VISIBLE
  const contactFontSize = Math.max(Math.min(width * 0.045, 42), 28); // 4.5% width, max 42px, min 28px - MUCH LARGER
  ctx.fillStyle = '#000000'; // Pure black for maximum contrast
  ctx.font = `bold ${contactFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`; // Bold, not semi-bold
  ctx.textAlign = 'left';
  
  const contactItems = [
    contact.phone && `📞 ${contact.phone}`,
    contact.email && `✉️  ${contact.email}`,
    contact.linkedin && `💼 ${contact.linkedin}`,
    contact.portfolio && `🌐 ${contact.portfolio}`
  ].filter(Boolean) as string[];

  const lineHeight = contactFontSize * 2.5; // Generous line height for readability
  const contactStartX = padding * 1.5;
  const maxTextWidth = width - contactStartX * 2;
  
  contactItems.forEach((item) => {
    // Ensure text fits but NEVER go below production minimum
    const metrics = ctx.measureText(item);
    let finalFontSize = contactFontSize;
    if (metrics.width > maxTextWidth) {
      const scale = maxTextWidth / metrics.width;
      finalFontSize = Math.max(contactFontSize * scale, 24); // Never go below 24px - PRODUCTION MINIMUM
      ctx.font = `bold ${finalFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`;
    }
    // Draw text with stroke for extra visibility
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeText(item, contactStartX, currentY, maxTextWidth);
    ctx.fillText(item, contactStartX, currentY, maxTextWidth);
    // Reset font for next item
    ctx.font = `bold ${contactFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`;
    currentY += lineHeight;
  });

  // Subtle border
  ctx.strokeStyle = '#e5e5e5';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding * 0.5, padding * 0.5, width - padding, height - padding);

  return canvas;
}
