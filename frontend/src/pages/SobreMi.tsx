import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AboutSarah from '../components/AboutSarah'

export default function SobreMi() {
  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="pt-28 md:pt-32">
        <AboutSarah />
      </main>

      <Footer />
    </div>
  )
}
