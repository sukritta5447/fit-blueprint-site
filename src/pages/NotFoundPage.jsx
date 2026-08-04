import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '../components/common/Container'
import { Footer } from '../components/Footer'
import { NavBar } from '@/components/nav/NavBar'

const notFoundClasses = {
  main:
    'grid min-h-[calc(100vh-16rem)] place-items-center py-24 text-center text-neutral-950',
  icon: 'mx-auto size-16 stroke-[1.8]',
  title: 'mt-6 text-2xl font-semibold tracking-tight',
  homeLink:
    'mt-8 inline-flex rounded-full bg-neutral-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800',
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />

      <main>
        <Container className={notFoundClasses.main}>
          <div>
            <AlertCircle
              aria-hidden="true"
              className={notFoundClasses.icon}
            />
            <h1 className={notFoundClasses.title}>Page Not Found</h1>
            <Link to="/" className={notFoundClasses.homeLink}>
              Go To Homepage
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
