import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Floorball() {
  const meshRef = useRef(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={meshRef}>
      {/* pallo */}
      <mesh castShadow>
        <sphereGeometry args={[1.2, 48, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.2} clearcoat={0.6} />
      </mesh>
      {/* reikäkuvio: pieniä sylintereitä "upotettuna" pintaan */}
      {Array.from({ length: 80 }).map((_, i) => {
        const theta = Math.acos((Math.random() * 2) - 1);
        const phi = Math.random() * Math.PI * 2;
        const r = 1.2;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.cos(theta);
        const z = r * Math.sin(theta) * Math.sin(phi);
        return (
          <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 20]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[360px]">
      <Canvas shadows camera={{ fov: 55, position: [0, 0.6, 4] }}>
        <ambientLight intensity={0.35} />
        <directionalLight intensity={1.1} position={[5, 6, 5]} />
        <Floorball />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
