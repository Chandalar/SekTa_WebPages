// pages/Contact.jsx
import Reveal from "../components/Reveal";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <section className="max-w-xl mx-auto px-4 py-12 text-white">
      <h2 className="text-2xl font-bold text-brand text-center mb-6">Yhteystiedot</h2>

      <Reveal>
        <div className="bg-card border border-white/10 rounded-xl p-6 grid gap-6">
          {/* Henkilö */}
          <div className="text-center">
            <p className="text-lg font-semibold">Mika Aaltonen</p>
            <p className="mt-1">
              📞{" "}
              <a href="tel:+358504802879" className="hover:underline">
                050-4802879
              </a>
            </p>
            <p className="mt-1">
              ✉️{" "}
              <a
                href="mailto:mika.aaltonen@aevan.fi"
                className="text-accent font-medium hover:underline"
              >
                mika.aaltonen@aevan.fi
              </a>
            </p>
          </div>

          {/* Instagram-nappi logolla */}
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/sektasalibandy/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              aria-label="Avaa SekTa Salibandyn Instagram"
            >
              {/* Instagram-logo (inline SVG, ei vaadi tiedostoa) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-6 h-6"
                role="img"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M224 202.66A53.34 53.34 0 1 0 277.34 256 53.38 53.38 0 0 0 224 202.66zm124.71-41a54.2 54.2 0 0 0-30.63-30.63C295.44 120 224 120 224 120s-71.44 0-94.08 11a54.2 54.2 0 0 0-30.63 30.63C88 145.56 88 224 88 224s0 71.44 11 94.08a54.2 54.2 0 0 0 30.63 30.63C152.56 360 224 360 224 360s71.44 0 94.08-11a54.2 54.2 0 0 0 30.63-30.63C360 295.44 360 224 360 224s0-78.44-11.29-62.37zM224 326a70 70 0 1 1 70-70 70 70 0 0 1-70 70zm90.71-126.86a16.29 16.29 0 1 1 16.29-16.29 16.29 16.29 0 0 1-16.29 16.29z"
                />
                <path
                  fill="currentColor"
                  d="M398.8 80.2C362.6 44 313.4 32 224 32S85.4 44 49.2 80.2 0 166.6 0 256s12 139.4 49.2 175.6S134.6 480 224 480s139.4-12 175.6-48.2S448 345.4 448 256 435.9 117.4 398.8 80.2zM400 256c0 84.7-11.3 113.9-21.8 124.4S308.7 402 224 402s-113.9-11.3-124.4-21.8S48 340.7 48 256 59.3 142.1 69.6 131.6 139.3 110 224 110s113.9 11.3 124.4 21.8S400 171.3 400 256z"
                />
              </svg>
              <span className="font-bold text-accent">Instagram: @sektasalibandy</span>
            </a>
          </div>

          {/* Vapaa infoteksti (valinnainen) */}
          <p className="text-center text-white/70 text-sm">
            Voit olla yhteydessä puhelimitse, sähköpostilla tai seuraa meitä Instagramissa.
          </p>
          
          {/* Hidden admin link */}
          <div className="text-center mt-4">
            <a href="/admin" className="text-white/20 hover:text-white/40 text-xs transition-colors">
              ·
            </a>
          </div>
        </div>
      </Reveal>
      </section>
    </div>
  );
}
