// AnimatedBackground.jsx
import { useEffect, useRef, useState } from "react";
import { Cog } from "lucide-react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

  // Oletusarvot
  const [gravity, setGravity] = useState(0.88);
  const [rest, setRest] = useState(0.9);
  const [friction, setFriction] = useState(0.998);
  const [mouseForce, setMouseForce] = useState(3);
  const [spinMult, setSpinMult] = useState(0);
  const [ballCount, setBallCount] = useState(20);
  const [ballSize, setBallSize] = useState(1);
  const [wireLevel, setWireLevel] = useState(40);
  const [ballColor, setBallColor] = useState("#ffffff");

  const ballsRef = useRef([]);
  const holeOffsetsRef = useRef([]);

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d", { alpha: true });
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function fit() {
      cvs.width = window.innerWidth * DPR;
      cvs.height = window.innerHeight * DPR;
      cvs.style.width = `${window.innerWidth}px`;
      cvs.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    }
    fit();

    const FLOOR_FRICTION = 0.96;
    const MOUSE_RADIUS = 80;
    let mouseX = -9999, mouseY = -9999;
    let pmx = mouseX, pmy = mouseY;
    let scrollY = 0;

    function resetBalls() {
      ballsRef.current = Array.from({ length: ballCount }, (_, index) => {
        const r = (10 + Math.random() * 12) * ballSize;
        const offset = Math.random() * Math.PI * 2;
        holeOffsetsRef.current[index] = offset;
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.7,
          r,
          vx: (-1 + Math.random() * 2) * 0.8,
          vy: (-1 + Math.random() * 2) * 0.2,
          rot: Math.random() * Math.PI * 2,
          spin: (-0.02 + Math.random() * 0.04),
        };
      });
    }
    resetBalls();

    function drawWireFloorball(x, y, r, rot, holeOffset) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.strokeStyle = ballColor;
      ctx.lineWidth = 1;
      for (let i = 1; i < wireLevel; i++) {
        const ratio = i / wireLevel;
        if (Math.abs(ratio - 0.5) < 0.02) continue; // poistetaan keskiviiva
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * Math.cos((Math.PI * i) / (wireLevel * 2)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const holeCount = 26;
      for (let i = 0; i < holeCount; i++) {
        const lat = Math.acos(-1 + (2 * i) / holeCount);
        const lon = (Math.PI * (1 + Math.sqrt(5)) * i + holeOffset + rot) % (Math.PI * 2);
        const x3d = Math.cos(lon) * Math.sin(lat);
        const y3d = Math.sin(lon) * Math.sin(lat);
        const z3d = Math.cos(lat);

        if (z3d > 0) {
          const hx = r * x3d;
          const hy = r * y3d;
          const hr = r * (0.18 * z3d + 0.06);
          ctx.beginPath();
          ctx.arc(hx, hy, hr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 23, 42, ${0.6 + 0.4 * z3d})`;
          ctx.fill();
        }
      }

      ctx.restore();
    }

    function step() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      const mxv = (mouseX - pmx) || 0;
      const myv = (mouseY - pmy) || 0;
      pmx = mouseX; pmy = mouseY;
      const s = 1 + Math.min(scrollY / 900, 2);

      const balls = ballsRef.current;

      for (let i = 0; i < balls.length; i++) {
        const p = balls[i];
        p.vy += gravity * s * 0.5;

        if (Math.abs(p.vx) < 0.001) p.vx = 0;
        else p.vx *= friction;
        if (Math.abs(p.vy) < 0.001) p.vy = 0;
        else p.vy *= friction;

        const dxm = p.x - mouseX;
        const dym = p.y - mouseY;
        const dist = Math.hypot(dxm, dym);
        if (dist < p.r + MOUSE_RADIUS) {
          const nx = dxm / (dist || 1);
          const ny = dym / (dist || 1);
          p.vx += (nx * mouseForce) + (mxv * 0.02);
          p.vy += (ny * mouseForce) + (myv * 0.02);
        }

        p.x += p.vx * s;
        p.y += p.vy * s;
        if (p.vx !== 0 || p.vy !== 0) {
          p.rot += p.spin * s + (p.vx / Math.max(8, p.r)) * spinMult;
        }

        if (p.x - p.r < 0) {
          p.x = p.r;
          p.vx = -p.vx * rest;
        } else if (p.x + p.r > W) {
          p.x = W - p.r;
          p.vx = -p.vx * rest;
        }
        if (p.y - p.r < 0) {
          p.y = p.r;
          p.vy = -p.vy * rest;
        } else if (p.y + p.r > H) {
          p.y = H - p.r;
          p.vy = -p.vy * rest;
          p.vx *= FLOOR_FRICTION;
        }

        drawWireFloorball(p.x, p.y, p.r, p.rot, holeOffsetsRef.current[i]);
      }

      req = requestAnimationFrame(step);
    }

    let req = requestAnimationFrame(step);

    const onResize = () => fit();
    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onScroll = () => { scrollY = window.scrollY; };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll);

    return () => {
      cancelAnimationFrame(req);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [gravity, rest, friction, mouseForce, spinMult, ballCount, ballSize, wireLevel, ballColor]);

  useEffect(() => {
    if (canvasRef.current) {
      const event = new Event("resize");
      window.dispatchEvent(event);
    }
  }, [ballCount, ballSize]);

  function resetDefaults() {
    setGravity(0.88);
    setRest(0.9);
    setFriction(0.998);
    setMouseForce(3);
    setSpinMult(0);
    setBallCount(20);
    setBallSize(1);
    setWireLevel(40);
    setBallColor("#ffffff");
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-35" />
      </div>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-2 left-2 z-50 bg-gray-800 hover:bg-gray-700 text-yellow-300 p-2 rounded-full shadow-lg"
        aria-label="Asetukset"
      >
        <Cog size={20} />
      </button>

      {showSettings && (
        <div className="fixed top-12 left-2 z-40 bg-gray-900 text-white backdrop-blur-md p-4 rounded-xl shadow-lg text-sm space-y-2 max-w-xs w-[260px]">
          <label>
            Gravity: {gravity.toFixed(2)}
            <input type="range" min="0" max="2" step="0.01" value={gravity} onChange={e => setGravity(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Bounce: {rest.toFixed(2)}
            <input type="range" min="0.3" max="1" step="0.01" value={rest} onChange={e => setRest(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Friction: {friction.toFixed(3)}
            <input type="range" min="0.9" max="1" step="0.001" value={friction} onChange={e => setFriction(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Mouse Force: {mouseForce.toFixed(2)}
            <input type="range" min="0" max="3" step="0.01" value={mouseForce} onChange={e => setMouseForce(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Spin Mult: {spinMult.toFixed(2)}
            <input type="range" min="0" max="0.3" step="0.01" value={spinMult} onChange={e => setSpinMult(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Ball Count: {ballCount}
            <input type="range" min="1" max="50" step="1" value={ballCount} onChange={e => setBallCount(parseInt(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Ball Size: {ballSize.toFixed(2)}
            <input type="range" min="0.5" max="2.5" step="0.01" value={ballSize} onChange={e => setBallSize(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Wireframe Detail: {wireLevel}
            <input type="range" min="1" max="50" step="1" value={wireLevel} onChange={e => setWireLevel(parseInt(e.target.value))} className="w-full accent-yellow-400" />
          </label>
          <label>
            Pallon väri:
            <input type="color" value={ballColor} onChange={e => setBallColor(e.target.value)} className="w-full h-8 p-0 border-0" />
          </label>
          <button onClick={resetDefaults} className="w-full mt-2 bg-yellow-600 text-white py-1 rounded hover:bg-yellow-500">Reset</button>
        </div>
      )}
    </>
  );
}
