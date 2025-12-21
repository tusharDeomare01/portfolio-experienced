/**
 * Share Utilities
 * 
 * Provides functions for generating share URLs and handling share functionality
 * across different social platforms.
 */

export interface ShareData {
  title: string;
  description: string;
  url: string;
  image?: string;
}

/**
 * Get the current page URL
 */
export const getCurrentUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

/**
 * Get the base URL of the site
 */
export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return 'https://tushar-deomare-portfolio.vercel.app';
  return `${window.location.protocol}//${window.location.host}`;
};

/**
 * Generate LinkedIn share URL
 */
export const getLinkedInShareUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    url: data.url,
    summary: data.description,
    title: data.title,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
};

/**
 * Generate Twitter/X share URL
 */
export const getTwitterShareUrl = (data: ShareData): string => {
  const text = `${data.title} - ${data.description}`;
  const params = new URLSearchParams({
    url: data.url,
    text: text.length > 280 ? text.substring(0, 277) + '...' : text,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

/**
 * Generate Facebook share URL
 */
export const getFacebookShareUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    u: data.url,
    quote: `${data.title} - ${data.description}`,
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
};

/**
 * Generate WhatsApp share URL
 */
export const getWhatsAppShareUrl = (data: ShareData): string => {
  const text = `${data.title}\n\n${data.description}\n\n${data.url}`;
  const params = new URLSearchParams({
    text: encodeURIComponent(text),
  });
  return `https://wa.me/?${params.toString()}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (err) {
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Check if Web Share API is available
 */
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Use Web Share API (mobile)
 * Note: Web Share API requires HTTPS (except localhost) and must be called from a user gesture
 */
export const shareViaWebAPI = async (data: ShareData): Promise<boolean> => {
  if (!isWebShareSupported()) {
    return false;
  }

  // Check if we're in a secure context (HTTPS or localhost)
  if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.debug('Web Share API requires HTTPS');
    return false;
  }

  try {
    // Prepare share data - some browsers require at least one of title, text, or url
    const shareData: ShareTargetData = {};
    
    if (data.title) shareData.title = data.title;
    if (data.description) shareData.text = data.description;
    if (data.url) shareData.url = data.url;

    // Ensure at least one field is present
    if (!shareData.title && !shareData.text && !shareData.url) {
      console.debug('Web Share API requires at least one of: title, text, or url');
      return false;
    }

    await navigator.share(shareData);
    return true;
  } catch (err) {
    // User cancelled (AbortError) is normal, don't log it
    if ((err as Error).name === 'AbortError') {
      return false;
    }
    
    // Other errors (NotAllowedError, TypeError, etc.) - log for debugging but don't throw
    console.debug('Web Share API error:', (err as Error).name, err);
    return false;
  }
};

// Type for navigator.share() parameter
interface ShareTargetData {
  title?: string;
  text?: string;
  url?: string;
}

/**
 * Open share URL in new window
 */
export const openShareUrl = (url: string): void => {
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1`
  );
};

