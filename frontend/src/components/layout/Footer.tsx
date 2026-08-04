export default function Footer() {
  return (
    <footer className="bg-mauve text-cream px-8 md:px-14 pt-16 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <span className="font-display text-xl">Sarah</span>
          <p className="text-sm opacity-75 mt-2 max-w-xs leading-relaxed">
            Horneado con Amor — repostería artesanal para tus momentos más dulces.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://wa.me/59176442752"
            target="_blank"
            rel="noreferrer"
            className="text-cream text-sm border border-cream/35 rounded-full px-5 py-2.5 hover:bg-cream/10 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://instagram.com/sarah.horneado"
            target="_blank"
            rel="noreferrer"
            className="text-cream text-sm border border-cream/35 rounded-full px-5 py-2.5 hover:bg-cream/10 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61586846324993"
            target="_blank"
            rel="noreferrer"
            className="text-cream text-sm border border-cream/35 rounded-full px-5 py-2.5 hover:bg-cream/10 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.tiktok.com/@roxanaantezanamej"
            target="_blank"
            rel="noreferrer"
            className="text-cream text-sm border border-cream/35 rounded-full px-5 py-2.5 hover:bg-cream/10 transition-colors"
          >
            TikTok
          </a>
        </div>
      </div>

      <p className="max-w-6xl mx-auto text-xs opacity-60 border-t border-cream/20 mt-10 pt-5">
        © {new Date().getFullYear()} Sarah — Horneado con Amor. Todos los derechos reservados.
      </p>
    </footer>
  )
}
