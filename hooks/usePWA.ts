'use client';

import { useState, useEffect, useCallback } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  isLoading: boolean;
  error: string | null;
}

interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: false,
    isOnline: true,
    hasUpdate: false,
    isLoading: false,
    error: null
  });

  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);

  // Verificar si la app está instalada
  const checkIfInstalled = useCallback(() => {
    if (typeof window !== 'undefined') {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      
      setState(prev => ({ ...prev, isInstalled }));
    }
  }, []);

  // Verificar conectividad
  const checkConnectivity = useCallback(() => {
    if (typeof window !== 'undefined') {
      const isOnline = navigator.onLine;
      const isOffline = !navigator.onLine;
      
      setState(prev => ({ ...prev, isOnline, isOffline }));
    }
  }, []);

  // Registrar service worker
  const registerServiceWorker = useCallback(async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const registration = await navigator.serviceWorker.register('/sw.js');
        
        console.log('Service Worker registered successfully:', registration);

        // Verificar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, hasUpdate: true }));
              }
            });
          }
        });

        // Manejar mensajes del service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            setState(prev => ({ ...prev, hasUpdate: true }));
          }
        });

        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Error al registrar Service Worker' 
        }));
      }
    }
  }, []);

  // Instalar PWA
  const installPWA = useCallback(async () => {
    if (deferredPrompt) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA installation accepted');
          setState(prev => ({ ...prev, isInstalled: true }));
        } else {
          console.log('PWA installation dismissed');
        }
        
        setDeferredPrompt(null);
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('PWA installation failed:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Error al instalar PWA' 
        }));
      }
    }
  }, [deferredPrompt]);

  // Actualizar PWA
  const updatePWA = useCallback(async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Recargar la página después de la actualización
          window.location.reload();
        }
        
        setState(prev => ({ ...prev, hasUpdate: false, isLoading: false }));
      } catch (error) {
        console.error('PWA update failed:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Error al actualizar PWA' 
        }));
      }
    }
  }, []);

  // Verificar actualizaciones
  const checkForUpdates = useCallback(async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      } catch (error) {
        console.error('Check for updates failed:', error);
      }
    }
  }, []);

  // Suscribirse a notificaciones push
  const subscribeToPushNotifications = useCallback(async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });

        console.log('Push notification subscription:', subscription);
        
        // Aquí se enviaría la suscripción al servidor
        // await fetch('/api/push/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(subscription)
        // });

        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Push notification subscription failed:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Error al suscribirse a notificaciones' 
        }));
      }
    }
  }, []);

  // Efectos
  useEffect(() => {
    checkIfInstalled();
    checkConnectivity();
    registerServiceWorker();

    // Event listeners para conectividad
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Event listener para prompt de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as PWAInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Event listener para app instalada
    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkIfInstalled, checkConnectivity, registerServiceWorker]);

  // Verificar actualizaciones periódicamente
  useEffect(() => {
    const interval = setInterval(checkForUpdates, 1000 * 60 * 60); // Cada hora
    
    return () => clearInterval(interval);
  }, [checkForUpdates]);

  return {
    ...state,
    installPWA,
    updatePWA,
    checkForUpdates,
    subscribeToPushNotifications
  };
};

// Hook para detectar si la app está en modo standalone (instalada)
export const useStandalone = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkStandalone = () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           (window.navigator as any).standalone === true;
        setIsStandalone(isStandalone);
      };

      checkStandalone();
      
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addEventListener('change', checkStandalone);

      return () => mediaQuery.removeEventListener('change', checkStandalone);
    }
  }, []);

  return isStandalone;
};

// Hook para detectar el tipo de dispositivo
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDeviceType = () => {
        const width = window.innerWidth;
        if (width < 768) {
          setDeviceType('mobile');
        } else if (width < 1024) {
          setDeviceType('tablet');
        } else {
          setDeviceType('desktop');
        }
      };

      checkDeviceType();
      window.addEventListener('resize', checkDeviceType);

      return () => window.removeEventListener('resize', checkDeviceType);
    }
  }, []);

  return deviceType;
};

// Hook para detectar orientación del dispositivo
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkOrientation = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        setOrientation(isPortrait ? 'portrait' : 'landscape');
      };

      checkOrientation();
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', checkOrientation);

      return () => {
        window.removeEventListener('resize', checkOrientation);
        window.removeEventListener('orientationchange', checkOrientation);
      };
    }
  }, []);

  return orientation;
};

