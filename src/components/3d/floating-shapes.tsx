import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  shape: 'box' | 'sphere' | 'octahedron';
}

export function FloatingShape({ position, color, speed = 1, shape }: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  const geometryMap = {
    box: <boxGeometry args={[1, 1, 1]} />,
    sphere: <sphereGeometry args={[0.5, 32, 32]} />,
    octahedron: <octahedronGeometry args={[0.5]} />
  };

  return (
    <mesh ref={meshRef} position={position}>
      {geometryMap[shape]}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

export function FloatingShapes() {
  return (
    <>
      <FloatingShape position={[-3, 2, -2]} color="#00ffff" shape="box" speed={0.8} />
      <FloatingShape position={[3, -1, -3]} color="#ff00ff" shape="sphere" speed={1.2} />
      <FloatingShape position={[0, 3, -4]} color="#80ff00" shape="octahedron" speed={0.6} />
      <FloatingShape position={[-2, -2, -1]} color="#8000ff" shape="box" speed={1.5} />
      <FloatingShape position={[4, 1, -2]} color="#00ff80" shape="sphere" speed={0.9} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#00ffff" />
      <pointLight position={[-5, 5, 0]} intensity={0.3} color="#ff00ff" />
    </>
  );
}