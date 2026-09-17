// Google Identity Services (GIS) integration helper

export const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  '111057460820-h8cnf27ble9gas9o913d8g6fb171pet5.apps.googleusercontent.com';

export interface DecodedGoogleUser {
  name: string;
  email: string;
  avatar?: string;
  sub?: string;
}

export function decodeGoogleJwt(token: string): DecodedGoogleUser | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      name: parsed.name || parsed.given_name || 'Google User',
      email: parsed.email,
      avatar: parsed.picture,
      sub: parsed.sub,
    };
  } catch (err) {
    console.warn('Failed to parse Google JWT', err);
    return null;
  }
}

// Check if GIS is loaded
export function isGoogleGsiAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google?.accounts?.id;
}

// Trigger Google Sign-In prompt or fallback
export function triggerGoogleSignIn(
  onSuccess: (user: DecodedGoogleUser) => void,
  onFallbackPrompt?: () => void
) {
  if (isGoogleGsiAvailable()) {
    try {
      const google = (window as any).google;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          const user = decodeGoogleJwt(response.credential);
          if (user && user.email) {
            onSuccess(user);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google OneTap dismissed/not displayed, using fallback');
          if (onFallbackPrompt) onFallbackPrompt();
        }
      });
      return;
    } catch (err) {
      console.warn('Google prompt initialization issue:', err);
    }
  }

  // If GIS is not loaded yet or blocked inside iframe
  if (onFallbackPrompt) {
    onFallbackPrompt();
  }
}
