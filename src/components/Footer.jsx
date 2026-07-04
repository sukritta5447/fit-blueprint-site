import { Mail, MapPin, Phone } from 'lucide-react'

import { Container } from './common/Container'

const contactLinks = [
  { label: 'Email', href: 'mailto:hello@example.com', Icon: Mail },
  { label: 'Phone', href: 'tel:+66000000000', Icon: Phone },
  { label: 'Location', href: '#location', Icon: MapPin },
]

const footerClasses = {
  contactIcon:
    'grid size-8 place-items-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700',
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-100 py-12">
      <Container className="flex flex-col gap-8 text-sm text-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span>Get in touch</span>
          <div className="flex items-center gap-2">
            {contactLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={footerClasses.contactIcon}
              >
                <Icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <a href="mailto:hello@example.com" className="hover:text-neutral-950 hover:underline">
          hello@example.com
        </a>
      </Container>
    </footer>
  )
}
