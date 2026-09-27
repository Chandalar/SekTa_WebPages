import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";

function Floorball() {
  const meshRef = useRef(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  // Calculate realistic hole positions once with Fibonacci sphere algorithm
  const holes = useMemo(() => {
    const count = 72;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const r = 1.205; // Slightly above sphere radius to avoid z-fighting
      const x = Math.cos(theta) * radius * r;
      const z = Math.sin(theta) * radius * r;
      const actualY = y * r;

      items.push({
        position: [x, actualY, z],
        rotation: [Math.acos(y), theta, 0]
      });
    }
    return items;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Glossy White Floorball Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 48, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Holes (characteristic 26-hole floorball pattern) */}
      {holes.map((h, i) => (
        <mesh key={i} position={h.position} rotation={h.rotation}>
          <cylinderGeometry args={[0.075, 0.075, 0.04, 16]} />
          <meshStandardMaterial color="#0b0a16" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene({ className = "w-44 h-44 sm:w-56 sm:h-56" }) {
  return (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <Canvas
        camera={{ fov: 48, position: [0, 0, 3.8] }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight intensity={1.2} position={[4, 5, 4]} />
        {/* SekTa brand colored rim lights */}
        <pointLight color="#f2a24a" intensity={2.5} position={[3, 2, 2]} />
        <pointLight color="#6b5bd7" intensity={2.5} position={[-3, -2, -2]} />
        <Floorball />
      </Canvas>
    </div>
  );
}
