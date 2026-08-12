import { SOCIAL_NETWORKS } from './SocialLinksData'
import { getSocialIcon } from './SocialIcons'

export default function SocialCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
      {SOCIAL_NETWORKS.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          className={`group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl2 border border-taupe/40 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${social.hoverBg}`}
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: social.brandColor }}
              >
                {getSocialIcon(social.id, 'w-6 h-6')}
              </div>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-cream text-[#3D2C33]/75 border border-taupe/30">
                {social.badgeText}
              </span>
            </div>

            <h3 className="font-display text-xl text-[#3D2C33] group-hover:text-mauve transition-colors">
              {social.name}
            </h3>
            <p className="text-xs font-semibold text-rose-metallic-dark mt-0.5 mb-2 font-mono">
              {social.handle}
            </p>
            <p className="text-xs text-[#6B5560] leading-relaxed line-clamp-2">
              {social.description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-taupe/20 flex items-center justify-between text-xs font-semibold text-[#3D2C33] group-hover:text-mauve transition-colors">
            <span>{social.ctaText}</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </a>
      ))}
    </div>
  )
}
