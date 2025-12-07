/**
 * Notification utilities for AI Assistant alerts
 * Handles browser notifications, page title updates, and notification preferences
 */

export interface NotificationPreferences {
  browserNotifications: boolean;
  soundEnabled: boolean;
  pageTitleNotifications: boolean;
  badgeEnabled: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  browserNotifications: true,
  soundEnabled: true,
  pageTitleNotifications: true,
  badgeEnabled: true,
};

const STORAGE_KEY = 'aiAssistantNotificationPreferences';
const ORIGINAL_TITLE = document.title;

/**
 * Get user notification preferences from localStorage
 */
export function getNotificationPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.debug('Could not load notification preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Save user notification preferences to localStorage
 */
export function saveNotificationPreferences(prefs: Partial<NotificationPreferences>): void {
  try {
    const current = getNotificationPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.debug('Could not save notification preferences:', error);
  }
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.debug('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.debug('Could not request notification permission:', error);
    return false;
  }
}

/**
 * Show browser notification
 */
export async function showBrowserNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  const prefs = getNotificationPreferences();
  if (!prefs.browserNotifications) {
    return;
  }

  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) {
      return;
    }
  }

  try {
    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'ai-assistant',
      requireInteraction: false,
      silent: false,
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.debug('Could not show browser notification:', error);
  }
}

/**
 * Update page title with notification badge
 */
let titleNotificationCount = 0;
let titleUpdateInterval: number | null = null;

export function updatePageTitle(count: number): void {
  const prefs = getNotificationPreferences();
  if (!prefs.pageTitleNotifications) {
    resetPageTitle();
    return;
  }

  titleNotificationCount = count;

  if (count > 0) {
    document.title = `(${count}) ${ORIGINAL_TITLE}`;
    
    // Blink effect for attention
    if (titleUpdateInterval === null) {
      let showCount = true;
      titleUpdateInterval = window.setInterval(() => {
        if (titleNotificationCount > 0) {
          document.title = showCount
            ? `(${titleNotificationCount}) ${ORIGINAL_TITLE}`
            : ORIGINAL_TITLE;
          showCount = !showCount;
        } else {
          resetPageTitle();
        }
      }, 1000);
    }
  } else {
    resetPageTitle();
  }
}

/**
 * Reset page title to original
 */
export function resetPageTitle(): void {
  titleNotificationCount = 0;
  if (titleUpdateInterval !== null) {
    clearInterval(titleUpdateInterval);
    titleUpdateInterval = null;
  }
  document.title = ORIGINAL_TITLE;
}

/**
 * Check if browser supports notifications
 */
export function supportsNotifications(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (!supportsNotifications()) {
    return null;
  }
  return Notification.permission;
}

