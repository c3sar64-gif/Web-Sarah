import { SOCIAL_NETWORKS } from '../SocialLinksData'
import { getSocialIcon } from '../SocialIcons'

export default function Footer() {
  return (
    <footer className="bg-mauve text-cream px-8 md:px-14 pt-16 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <span className="font-display text-2xl font-bold tracking-wide">Sarah</span>
          <p className="text-sm opacity-80 mt-2 max-w-xs leading-relaxed">
            Horneado con Amor — repostería artesanal para tus momentos más dulces.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/70 mb-3">
            Síguenos en redes sociales
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_NETWORKS.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Seguir en ${social.name}`}
                className="group flex items-center gap-2.5 bg-cream/10 hover:bg-cream/25 border border-cream/20 text-cream text-xs font-medium rounded-full px-4 py-2.5 transition-all duration-300 hover:scale-105"
              >
                <span className="transition-transform group-hover:scale-110">
                  {getSocialIcon(social.id, 'w-4 h-4')}
                </span>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-xs opacity-60 border-t border-cream/20 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Sarah — Horneado con Amor. Todos los derechos reservados.</p>
        <p className="text-cream/80">Bolivia 🇧🇴 — Envíos y pedidos personalizados</p>
      </div>
    </footer>
  )
}

