'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import MobileButton from './mobile-button';

interface PWAInstallPromptProps {
  className?: string;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className = '',
  showOnMobile = true,
  showOnTablet = true,
  showOnDesktop = false,
  autoHide = true,
  autoHideDelay = 10000
}) => {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isLoading,
    error,
    installPWA
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Detectar tipo de dispositivo
  useEffect(() => {
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
  }, []);

  // Mostrar prompt basado en condiciones
  useEffect(() => {
    const shouldShow = 
      isInstallable && 
      !isInstalled && 
      !isOffline &&
      ((deviceType === 'mobile' && showOnMobile) ||
       (deviceType === 'tablet' && showOnTablet) ||
       (deviceType === 'desktop' && showOnDesktop));

    if (shouldShow) {
      setIsVisible(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, isInstalled, isOffline, deviceType, showOnMobile, showOnTablet, showOnDesktop, autoHide, autoHideDelay]);

  // Obtener icono del dispositivo
  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  // Obtener texto del dispositivo
  const getDeviceText = () => {
    switch (deviceType) {
      case 'mobile':
        return 'Instalar en tu teléfono';
      case 'tablet':
        return 'Instalar en tu tablet';
      case 'desktop':
        return 'Instalar aplicación';
      default:
        return 'Instalar aplicación';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              {getDeviceIcon()}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {getDeviceText()}
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Instala esta aplicación en tu {deviceType === 'mobile' ? 'teléfono' : deviceType === 'tablet' ? 'tablet' : 'dispositivo'} para acceder más rápido y tener una experiencia offline.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <MobileButton
            onClick={installPWA}
            disabled={isLoading}
            isLoading={isLoading}
            fullWidth
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar
          </MobileButton>
          
          <MobileButton
            onClick={() => setIsVisible(false)}
            variant="outline"
            size="sm"
          >
            Más tarde
          </MobileButton>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Acceso rápido</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Modo offline</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Notificaciones</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Mejor rendimiento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Banner de instalación más prominente
export const PWAInstallBanner: React.FC<{
  className?: string;
  variant?: 'banner' | 'modal';
}> = ({ className = '', variant = 'banner' }) => {
  const {
    isInstallable,
    isInstalled,
    installPWA,
    isLoading
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstallable && !isInstalled) {
      setIsVisible(true);
    }
  }, [isInstallable, isInstalled]);

  if (!isVisible) {
    return null;
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instalar Hotel PMS
            </h3>
            
            <p className="text-gray-600 mb-6">
              Instala esta aplicación en tu dispositivo para una mejor experiencia y acceso offline.
            </p>
            
            <div className="flex space-x-3">
              <MobileButton
                onClick={installPWA}
                disabled={isLoading}
                isLoading={isLoading}
                fullWidth
              >
                Instalar
              </MobileButton>
              
              <MobileButton
                onClick={() => setIsVisible(false)}
                variant="outline"
              >
                Cancelar
              </MobileButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 ${className}`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Download className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Instalar Hotel PMS</h3>
            <p className="text-blue-100 text-sm">
              Accede más rápido y disfruta de funcionalidades offline
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <MobileButton
            onClick={installPWA}
            disabled={isLoading}
            isLoading={isLoading}
            variant="secondary"
            size="sm"
          >
            Instalar
          </MobileButton>
          
          <MobileButton
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white hover:text-blue-600"
          >
            Más tarde
          </MobileButton>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
