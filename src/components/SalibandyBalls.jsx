import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function SalibandyBall({ ball, mouse }) {
  const group = useRef();

  const holePoints = useMemo(() => {
    const n = 30;
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const holesRef = useRef();

  useMemo(() => {
    if (!holesRef.current) return;
    const dummy = new THREE.Object3D();
    const r = 1.01;
    const scale = 0.15;
    holePoints.forEach((p, i) => {
      dummy.position.set(p.x * r, p.y * r, p.z * r);
      dummy.lookAt(0, 0, 0);
      dummy.scale.set(scale, 0.03, scale);
      dummy.updateMatrix();
      holesRef.current.setMatrixAt(i, dummy.matrix);
    });
    holesRef.current.instanceMatrix.needsUpdate = true;
  }, [holePoints]);

  useFrame((_, delta) => {
    if (!group.current) return;

    // Painovoima
    ball.vy += 0.005;

    // Liike
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Seinäkimmokkeet
    const bounds = {
      x: 10,
      y: 6,
    };
    if (ball.x < -bounds.x || ball.x > bounds.x) {
      ball.vx *= -0.85;
      ball.x = THREE.MathUtils.clamp(ball.x, -bounds.x, bounds.x);
    }
    if (ball.y < -bounds.y || ball.y > bounds.y) {
      ball.vy *= -0.85;
      ball.y = THREE.MathUtils.clamp(ball.y, -bounds.y, bounds.y);
    }

    // Hiiren törmäys
    const dx = ball.x - mouse.current.x;
    const dy = ball.y - mouse.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1.5) {
      const nx = dx / dist;
      const ny = dy / dist;
      ball.vx += nx * 0.2;
      ball.vy += ny * 0.2;
    }

    // Sijoitus ja pyöritys
    group.current.position.set(ball.x, ball.y, ball.z);
    group.current.rotation.y += delta * ball.spin;
    group.current.rotation.x += delta * ball.spin * 0.6;
  });

  return (
    <group ref={group} scale={ball.scale}>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} wireframe />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <instancedMesh ref={holesRef} args={[null, null, holePoints.length]}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </instancedMesh>
    </group>
  );
}

export default function SalibandyBallsBackground() {
  const mouse = useRef({ x: 0, y: 0 });
  const [balls] = useState(() =>
    Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 10,
      z: Math.random() * -4 - 6,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      scale: 0.8 + Math.random() * 0.6,
      spin: 0.003 + Math.random() * 0.004,
    }))
  );

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 20 - 10;
      mouse.current.y = -(e.clientY / window.innerHeight) * 12 + 6;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 16], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 6, 8]} intensity={1.2} />
        {balls.map((ball, i) => (
          <SalibandyBall key={i} ball={ball} mouse={mouse} />
        ))}
      </Canvas>
    </div>
  );
}
