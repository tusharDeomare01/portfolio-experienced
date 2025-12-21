import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Linkedin,
  Twitter,
  Facebook,
  MessageCircle,
  Copy,
  X,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import type { ShareData } from '@/lib/shareUtils';

interface ShareMenuProps {
  shareData: ShareData;
  onClose: () => void;
  onCopyLink: () => void;
  onSocialShare: (platform: 'linkedin' | 'twitter' | 'facebook' | 'whatsapp') => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isMobile?: boolean;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

export const ShareMenu = ({
  shareData: _shareData, // Unused but kept for API consistency
  onClose,
  onCopyLink,
  onSocialShare,
  position = 'bottom',
  isMobile = false,
  anchorRef,
}: ShareMenuProps) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === 'dark';

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when menu is open (mobile)
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile]);

  const shareOptions = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: '#0077b5',
      onClick: () => onSocialShare('linkedin'),
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      onClick: () => onSocialShare('twitter'),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      onClick: () => onSocialShare('facebook'),
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      onClick: () => onSocialShare('whatsapp'),
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: Copy,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      onClick: onCopyLink,
    },
  ];

  // Mobile: Bottom sheet
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[20000] flex items-end"
          onClick={onClose}
          onTouchStart={(e) => {
            // Prevent touch events from bubbling
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className="relative w-full bg-background/95 backdrop-blur-xl border-t border-border rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-border/50">
              <h3 className="text-lg font-semibold text-foreground">Share</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Share Options Grid */}
            <div className="p-6 grid grid-cols-4 gap-3 sm:gap-4">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      option.onClick();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      option.onClick();
                    }}
                    className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation min-h-[80px]"
                    whileTap={{ scale: 0.95 }}
                    aria-label={option.label}
                    type="button"
                  >
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: `${option.color}15` }}
                    >
                      <Icon size={22} style={{ color: option.color }} />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center leading-tight">
                      {option.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Safe area for mobile */}
            <div className="h-safe-area-inset-bottom bg-background" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop: Dropdown menu
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2 top-0',
    right: 'left-full ml-2 top-0',
  };

  // Calculate position to prevent overflow
  const getMenuStyle = () => {
    if (!anchorRef?.current) return {};
    
    const rect = anchorRef.current.getBoundingClientRect();
    const menuWidth = 224; // w-56 = 224px
    const menuHeight = 280; // approximate height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let style: React.CSSProperties = {};
    
    // Adjust horizontal position if needed
    if (position === 'right' && rect.right + menuWidth > viewportWidth) {
      style.right = '100%';
      style.left = 'auto';
      style.marginRight = '0.5rem';
      style.marginLeft = '0';
    } else if (position === 'left' && rect.left - menuWidth < 0) {
      style.left = '100%';
      style.right = 'auto';
      style.marginLeft = '0.5rem';
      style.marginRight = '0';
    }
    
    // Adjust vertical position if needed
    if (position === 'bottom' && rect.bottom + menuHeight > viewportHeight) {
      style.bottom = '100%';
      style.top = 'auto';
      style.marginBottom = '0.5rem';
      style.marginTop = '0';
    } else if (position === 'top' && rect.top - menuHeight < 0) {
      style.top = '100%';
      style.bottom = 'auto';
      style.marginTop = '0.5rem';
      style.marginBottom = '0';
    }
    
    return style;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -8 : position === 'top' ? 8 : 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={getMenuStyle()}
        className={`
          absolute ${positionClasses[position]} z-[10000]
          w-56 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground">Share</h3>
        </div>

        {/* Options List */}
        <div className="py-2">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                onClick={option.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-pink-500/10 dark:hover:bg-pink-500/20 active:bg-pink-500/20 dark:active:bg-pink-500/30 transition-colors text-left group"
                whileHover={{ x: 2 }}
                whileTap={{ x: 0 }}
                aria-label={option.label}
              >
                <Icon 
                  size={18} 
                  style={{ color: option.color }} 
                  className="transition-transform group-hover:scale-110"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

