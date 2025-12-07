"use client";

import { useState, useEffect } from "react";
import { Settings, Bell, BellOff, Volume2, VolumeX, FileText, FileX, Circle, CircleOff } from "lucide-react";
import { Button } from "@/components/lightswind/button";
import { Card } from "@/components/lightswind/card";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  getNotificationPermission,
  supportsNotifications,
} from "@/lib/notificationUtils";
import type { NotificationPreferences } from "@/lib/notificationUtils";

interface NotificationSettingsProps {
  onClose?: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(
    getNotificationPermission()
  );

  useEffect(() => {
    setPrefs(getNotificationPreferences());
    setNotificationPermission(getNotificationPermission());
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    saveNotificationPreferences(newPrefs);

    // If enabling browser notifications, request permission
    if (key === 'browserNotifications' && newPrefs.browserNotifications && notificationPermission !== 'granted') {
      requestNotificationPermission().then((granted) => {
        if (!granted) {
          // Revert if permission denied
          const revertedPrefs = { ...prefs, browserNotifications: false };
          setPrefs(revertedPrefs);
          saveNotificationPreferences(revertedPrefs);
        }
        setNotificationPermission(getNotificationPermission());
      });
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(getNotificationPermission());
    if (granted) {
      const newPrefs = { ...prefs, browserNotifications: true };
      setPrefs(newPrefs);
      saveNotificationPreferences(newPrefs);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Notification Settings</h3>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            ×
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {/* Browser Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {prefs.browserNotifications ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Browser Notifications</p>
              <p className="text-xs text-muted-foreground">
                Desktop notifications when AI responds
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle('browserNotifications')}
            className="h-8 w-8 p-0"
            disabled={!supportsNotifications() || notificationPermission === 'denied'}
          >
            {prefs.browserNotifications ? (
              <Circle className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <CircleOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {!supportsNotifications() && (
          <p className="text-xs text-muted-foreground pl-6">
            Your browser doesn't support notifications
          </p>
        )}

        {supportsNotifications() && notificationPermission === 'denied' && (
          <div className="pl-6">
            <p className="text-xs text-destructive mb-2">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {supportsNotifications() && notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
          <div className="pl-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestPermission}
              className="text-xs h-7"
            >
              Request Permission
            </Button>
          </div>
        )}

        {/* Sound Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {prefs.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Sound Alerts</p>
              <p className="text-xs text-muted-foreground">
                Play sounds for notifications
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle('soundEnabled')}
            className="h-8 w-8 p-0"
          >
            {prefs.soundEnabled ? (
              <Circle className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <CircleOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Page Title Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {prefs.pageTitleNotifications ? (
              <FileText className="h-4 w-4 text-primary" />
            ) : (
              <FileX className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Page Title Alerts</p>
              <p className="text-xs text-muted-foreground">
                Show unread count in browser tab title
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle('pageTitleNotifications')}
            className="h-8 w-8 p-0"
          >
            {prefs.pageTitleNotifications ? (
              <Circle className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <CircleOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Badge Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {prefs.badgeEnabled ? (
              <Circle className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <CircleOff className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Unread Badge</p>
              <p className="text-xs text-muted-foreground">
                Show unread count badge on button
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle('badgeEnabled')}
            className="h-8 w-8 p-0"
          >
            {prefs.badgeEnabled ? (
              <Circle className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <CircleOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

