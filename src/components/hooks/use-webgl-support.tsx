import { useState, useEffect } from 'react';

interface WebGLSupport {
  isSupported: boolean;
  isInitialized: boolean;
  error: string | null;
}

/**
 * Hook to detect WebGL support and availability
 */
export function useWebGLSupport(): WebGLSupport {
  const [support, setSupport] = useState<WebGLSupport>({
    isSupported: false,
    isInitialized: false,
    error: null,
  });

  useEffect(() => {
    try {
      // Check if WebGL is available
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      
      if (!gl) {
        setSupport({
          isSupported: false,
          isInitialized: true,
          error: 'WebGL is not supported in this browser',
        });
        return;
      }

      // Check for required extensions
      const requiredExtensions = ['OES_texture_float'];
      const missingExtensions: string[] = [];
      
      for (const ext of requiredExtensions) {
        if (!gl.getExtension(ext)) {
          missingExtensions.push(ext);
        }
      }

      if (missingExtensions.length > 0) {
        setSupport({
          isSupported: false,
          isInitialized: true,
          error: `Missing WebGL extensions: ${missingExtensions.join(', ')}`,
        });
        return;
      }

      setSupport({
        isSupported: true,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      setSupport({
        isSupported: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Unknown WebGL error',
      });
    }
  }, []);

  return support;
}

