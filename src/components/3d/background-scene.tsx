import { Canvas } from '@react-three/fiber';
import { FloatingShapes } from './floating-shapes';
import { Suspense } from 'react';

interface BackgroundSceneProps {
  className?: string;
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      >
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  );
}