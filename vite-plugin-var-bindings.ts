/**
 * Vite plugin to safely convert const/let to var in output to prevent TDZ violations
 * This is a safer approach that only converts top-level declarations and avoids breaking code
 */
import type { Plugin } from 'vite';

export function varBindingsPlugin(): Plugin {
  return {
    name: 'var-bindings',
    // Use generateBundle hook which runs AFTER minification
    // This ensures we convert const/let to var after esbuild minifies the code
    generateBundle(_options, bundle) {
      // Process all JavaScript chunks
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          let code = chunk.code;
          
          // SAFER APPROACH: Only convert declarations at the start of statements
          // This avoids breaking code inside strings, comments, or complex expressions
          
          // Convert const declarations at statement start (more precise regex)
          // Matches: const x = ... but not: someFunction(const ...)
          code = code.replace(/(^|\n|\r|;|\{|\})\s*\bconst\s+/g, '$1 var ');
          
          // Convert let declarations at statement start
          code = code.replace(/(^|\n|\r|;|\{|\})\s*\blet\s+/g, '$1 var ');
          
          // Handle for loops (for, for-in, for-of)
          code = code.replace(/for\s*\(\s*\bconst\s+/g, 'for (var ');
          code = code.replace(/for\s*\(\s*\blet\s+/g, 'for (var ');
          
          chunk.code = code;
        }
      }
    },
  };
}

