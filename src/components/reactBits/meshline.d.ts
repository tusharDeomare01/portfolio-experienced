import 'react';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: React.DetailedHTMLProps<React.HTMLAttributes<MeshLineGeometry>, MeshLineGeometry>;
      meshLineMaterial: React.DetailedHTMLProps<React.HTMLAttributes<MeshLineMaterial>, MeshLineMaterial>;
    }
  }
}

export {};
