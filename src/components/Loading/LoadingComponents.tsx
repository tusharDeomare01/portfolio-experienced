/**
 * Base Skeleton Component with shimmer effect
 * Uses modern shimmer animation for better UX
 */
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-gradient-to-r from-muted via-muted/50 to-muted rounded relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

/**
 * HeaderSkeleton - Modern skeleton for header navigation
 * Matches the header structure with navigation items
 */
export const HeaderSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center px-4 py-3">
    <div className="border border-gray-100 dark:border-gray-900 backdrop-blur-xl w-full xl:max-w-6xl rounded-full flex items-center justify-between px-6 py-3">
      {/* Logo skeleton */}
      <Skeleton className="h-6 w-6 rounded-full" />
      
      {/* Navigation items skeleton */}
      <nav className="hidden md:flex flex-1 justify-center">
        <div className="flex space-x-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-4 w-16 rounded" />
          ))}
        </div>
      </nav>
      
      {/* Action buttons skeleton */}
      <div className="hidden md:flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      {/* Mobile menu button skeleton */}
      <div className="md:hidden">
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
  </div>
);

/**
 * SectionSkeleton - Modern skeleton for content sections
 * Shows multiple content blocks with varying heights
 */
export const SectionSkeleton = () => (
  <div className="w-full py-12 space-y-8">
    {/* Section header skeleton */}
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-8 w-48 rounded" />
      </div>
      <Skeleton className="h-4 w-96 max-w-full rounded" />
    </div>
    
    {/* Content blocks skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * PageSkeleton - Modern skeleton for full page layouts
 * Matches project detail page structure
 */
export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Back button skeleton */}
      <Skeleton className="h-6 w-32 rounded" />
      
      {/* Hero section skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-64 rounded" />
            <Skeleton className="h-6 w-96 max-w-full rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
        <Skeleton className="h-4 w-full max-w-4xl rounded" />
        <Skeleton className="h-4 w-5/6 max-w-4xl rounded" />
      </div>
      
      {/* Tech stack skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-7 w-48 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="p-6 rounded-xl border bg-background/50 space-y-3">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Features skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-7 w-64 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-xl border bg-background/80 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * ComponentSkeleton - Modern skeleton for small UI components
 * Used for Dock, Tour, and other small components
 */
export const ComponentSkeleton = () => (
  <div className="flex items-center justify-center p-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-8 w-24 rounded-full mx-auto" />
    </div>
  </div>
);

/**
 * AIAssistantSkeleton - Modern skeleton for AI Assistant button
 * Matches the floating button position and size
 */
export const AIAssistantSkeleton = () => (
  <div className="fixed bottom-20 right-3 sm:bottom-28 sm:right-4 md:bottom-7 md:right-7 z-[999]">
    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
      <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-full" />
    </div>
  </div>
);

/**
 * BackgroundSkeleton - Minimal skeleton for background effects
 * Very subtle loading state
 */
export const BackgroundSkeleton = () => (
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background opacity-50" />
  </div>
);

/**
 * Legacy loaders (kept for backward compatibility if needed)
 * These are now replaced by skeleton components above
 */
export const SectionLoader = SectionSkeleton;
export const PageLoader = PageSkeleton;
export const ComponentLoader = ComponentSkeleton;
export const HeaderLoader = HeaderSkeleton;
export const BackgroundLoader = BackgroundSkeleton;
export const AIAssistantLoader = AIAssistantSkeleton;
