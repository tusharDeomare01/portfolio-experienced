import { useState, useCallback, useEffect, useRef } from 'react';
import { Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../lightswind/button';
import {
  shareViaWebAPI,
  copyToClipboard,
  isWebShareSupported,
  getLinkedInShareUrl,
  getTwitterShareUrl,
  getFacebookShareUrl,
  getWhatsAppShareUrl,
  openShareUrl,
  type ShareData,
} from '@/lib/shareUtils';
import { ShareMenu } from './ShareMenu';

interface ShareButtonProps {
  shareData: ShareData;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const ShareButton = ({
  shareData,
  variant = 'outline',
  size = 'md',
  className = '',
  showLabel = false,
  position = 'bottom',
}: ShareButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Handle share action - toggle menu on desktop, use Web Share API on mobile
  const handleShare = useCallback(async (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Mobile: ONLY use device UI's share widget (Web Share API)
    if (isMobile) {
      if (isWebShareSupported()) {
        // Use native Web Share API - no fallback menu on mobile
        try {
          await shareViaWebAPI(shareData);
          // Whether successful or cancelled, don't show custom menu on mobile
          return;
        } catch (error) {
          // If Web Share API fails, silently fail (user preference: device UI only)
          console.debug('Web Share API failed on mobile');
          return;
        }
      } else {
        // Web Share API not supported - silently fail (user preference: device UI only)
        console.debug('Web Share API not supported on this mobile device');
        return;
      }
    }

    // Desktop: Toggle the share menu
    setIsMenuOpen((prev) => !prev);
  }, [shareData, isMobile]);

  // Handle copy link
  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setIsMenuOpen(false);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  }, [shareData.url]);

  // Handle social platform share
  const handleSocialShare = useCallback((platform: 'linkedin' | 'twitter' | 'facebook' | 'whatsapp') => {
    let url = '';
    switch (platform) {
      case 'linkedin':
        url = getLinkedInShareUrl(shareData);
        break;
      case 'twitter':
        url = getTwitterShareUrl(shareData);
        break;
      case 'facebook':
        url = getFacebookShareUrl(shareData);
        break;
      case 'whatsapp':
        url = getWhatsAppShareUrl(shareData);
        break;
    }
    openShareUrl(url);
    setIsMenuOpen(false);
  }, [shareData]);

  // Map size to Button component's accepted sizes (Button doesn't support 'md', use 'default')
  const buttonSize: 'sm' | 'default' | 'lg' | 'icon' = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';
  
  // Icon size based on button size
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  // Professional styling to match app's button design - matching HeroSection button styles
  const getButtonClassName = () => {
    // Override padding for icon-only buttons to ensure proper square sizing
    const paddingOverride = !showLabel 
      ? (size === 'sm' ? '!p-2 !min-w-[36px]' : size === 'lg' ? '!p-3 !min-w-[48px]' : '!p-2.5 !min-w-[40px]')
      : '';
    
    // Base classes with professional polish - matching HeroSection buttons
    // Using important modifiers to override Button component defaults
    const baseClasses = `${paddingOverride} ${className} touch-manipulation 
      !font-semibold !rounded-lg 
      !shadow-md hover:!shadow-xl active:!shadow-md
      will-change-transform transform translateZ(0)
      hover:scale-[1.05] hover:-translate-y-0.5 
      active:scale-[0.96] active:translate-y-0
      relative overflow-hidden
      transition-all duration-300`;
    
    // Add active state styling when menu is open (desktop only)
    const activeState = isMenuOpen && !isMobile ? '!bg-pink-500 !text-white !border-pink-600' : '';
    
    if (variant === 'outline') {
      // Match HeroSection outline button: border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-pink-600
      return `${baseClasses} !border-2 !border-pink-500 !text-pink-500 
        hover:!bg-pink-500 hover:!text-white 
        dark:!border-pink-500 dark:!text-pink-400 
        dark:hover:!bg-pink-500 dark:hover:!text-white 
        !bg-background/90 backdrop-blur-sm
        hover:!border-pink-600
        ${activeState}`;
    }
    
    if (variant === 'ghost') {
      // Professional ghost style with pink accent - subtle and elegant
      return `${baseClasses} !text-pink-500 hover:!bg-pink-500/10 
        dark:!text-pink-400 dark:hover:!bg-pink-500/10 
        !bg-background/70 backdrop-blur-sm !border-0
        hover:!shadow-pink-500/20
        ${isMenuOpen && !isMobile ? '!bg-pink-500/20 dark:!bg-pink-500/20' : ''}`;
    }
    
    // default variant - match HeroSection primary button: bg-pink-500 hover:bg-pink-600 text-white
    return `${baseClasses} !bg-pink-500 hover:!bg-pink-600 !text-white !border-0
      !shadow-pink-500/30 hover:!shadow-pink-500/50
      ${isMenuOpen && !isMobile ? '!bg-pink-600 !shadow-pink-500/50' : ''}`;
  };

  return (
    <div ref={buttonRef} className="relative inline-block">
      {/* Professional button wrapper with glow effect - matching HeroSection */}
      <div className="relative group/share-btn">
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-500/30 to-pink-600/30 opacity-0 group-hover/share-btn:opacity-100 blur-sm transition-opacity duration-300 -z-10" />
        
        <Button
          onClick={handleShare}
          onTouchEnd={(e) => {
            // Ensure touch events work properly on mobile
            e.preventDefault();
            handleShare(e as any);
          }}
          variant={variant}
          size={buttonSize}
          className={getButtonClassName()}
          aria-label="Share"
          type="button"
        >
          {showCopiedToast ? (
            <>
              <Check size={iconSize} className="animate-in fade-in duration-200" />
              {showLabel && <span>Copied!</span>}
            </>
          ) : (
            <>
              <Share2 size={iconSize} className="transition-transform duration-300 group-hover/share-btn:rotate-12" />
              {showLabel && <span>Share</span>}
            </>
          )}
        </Button>
      </div>

      {/* Share Menu - Desktop Only */}
      <AnimatePresence>
        {isMenuOpen && !isMobile && (
          <ShareMenu
            shareData={shareData}
            onClose={() => setIsMenuOpen(false)}
            onCopyLink={handleCopyLink}
            onSocialShare={handleSocialShare}
            position={position}
            isMobile={false}
            anchorRef={buttonRef}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showCopiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[20001] 
            bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl px-4 py-3 
            flex items-center gap-2 min-w-[200px] max-w-[90vw]"
          >
            <Check size={18} className="text-green-500 flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              Link copied!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

