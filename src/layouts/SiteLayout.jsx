import { Footer } from '../components/navigation/Footer'
import { Header } from '../components/navigation/Header'

export function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
