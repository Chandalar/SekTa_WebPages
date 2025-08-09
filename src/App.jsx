import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // varmista että käytät tätä
//import SalibandyBallsBackground from "./components/SalibandyBalls";

const Home = lazy(() => import("./pages/Home"));
const Team = lazy(() => import("./pages/Team"));
const Matches = lazy(() => import("./pages/Matches"));
const News = lazy(() => import("./pages/News"));
const Contact = lazy(() => import("./pages/Contact"));
const History = lazy(() => import("./pages/History")); // uusi sivu, alla skeleton

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] pt-20">
        <Suspense fallback={<div className="p-8 text-white/70">Ladataan…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/joukkue" element={<Team />} />
            <Route path="/ottelut" element={<Matches />} />
            <Route path="/uutiset" element={<News />} />
            <Route path="/yhteys" element={<Contact />} />
            <Route path="/historia" element={<History />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-white/10 text-white/60">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <span>© {new Date().getFullYear()} SekTa ry</span>
          <span className="text-sm">Teema: SekTa IG (violetti/oranssi)</span>
        </div>
      </footer>
    </>
  );
}
