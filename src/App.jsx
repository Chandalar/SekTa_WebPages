import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import { useEffect } from "react";

const Home = lazy(() => import("./pages/Home"));
const Team = lazy(() => import("./pages/Team"));
const News = lazy(() => import("./pages/News"));
const Contact = lazy(() => import("./pages/Contact"));
const History = lazy(() => import("./pages/History"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Admin = lazy(() => import("./pages/Admin"));
const Formation = lazy(() => import("./pages/Formation"));

export default function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] pt-20">
        <Suspense fallback={<div className="p-8 text-white/70">Ladataan…</div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/joukkue" element={<PageTransition><Team /></PageTransition>} />
              <Route path="/tilastot" element={<PageTransition><Statistics /></PageTransition>} />
              <Route path="/uutiset" element={<PageTransition><News /></PageTransition>} />
              <Route path="/yhteys" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/historia" element={<PageTransition><History /></PageTransition>} />
              <Route path="/taktiikka" element={<PageTransition><Formation /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
            </Routes>
          </AnimatePresence>
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