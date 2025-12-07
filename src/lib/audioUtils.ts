/**
 * Audio utility for playing notification sounds
 * Uses Web Audio API to generate a pleasant notification sound
 * Handles browser autoplay policies by using a singleton audio context
 */

// Singleton audio context to handle browser autoplay policies
let audioContext: AudioContext | null = null;
let audioContextInitialized = false;

/**
 * Initialize or resume audio context (required for browser autoplay policies)
 */
async function ensureAudioContext(): Promise<AudioContext | null> {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume context if suspended (required after user interaction)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    audioContextInitialized = true;
    return audioContext;
  } catch (error) {
    console.debug('Could not initialize audio context:', error);
    return null;
  }
}

/**
 * Initialize audio context on first user interaction
 */
export function initializeAudioContext() {
  if (!audioContextInitialized) {
    ensureAudioContext().catch(() => {
      // Silently fail - will retry on next sound play
    });
  }
}

export async function playNotificationSound() {
  try {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    
    // Create oscillator for the sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure sound - pleasant notification tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime); // Start at 800Hz
    oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1); // Rise to 1000Hz
    
    // Configure volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); // Decay
    
    // Play the sound
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
    
    // Clean up
    oscillator.onended = () => {
      // Don't close the context - keep it for future sounds
    };
  } catch (error) {
    // Silently fail if audio context is not available
    // (e.g., user hasn't interacted with page yet, or browser doesn't support it)
    console.debug('Could not play notification sound:', error);
  }
}

/**
 * Play a more subtle notification sound for interactive prompts
 */
export async function playSubtleNotificationSound() {
  try {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Softer, more subtle tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
    
    oscillator.onended = () => {
      // Don't close the context - keep it for future sounds
    };
  } catch (error) {
    console.debug('Could not play subtle notification sound:', error);
  }
}

/**
 * Play a notification sound when AI responds (more noticeable)
 */
export async function playResponseNotificationSound() {
  try {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Pleasant two-tone chime for new responses
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    oscillator.frequency.exponentialRampToValueAtTime(1108, ctx.currentTime + 0.15); // C#6 note
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.35);
    
    oscillator.onended = () => {
      // Don't close the context - keep it for future sounds
    };
  } catch (error) {
    console.debug('Could not play response notification sound:', error);
  }
}

/**
 * Play a gentle ping sound for message received
 */
export async function playMessageReceivedSound() {
  try {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Short, gentle ping
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
    
    oscillator.onended = () => {
      // Don't close the context - keep it for future sounds
    };
  } catch (error) {
    console.debug('Could not play message received sound:', error);
  }
}

