import { footerClasses } from '@/styles/footer.styles'
import { Container } from './common/Container'

const contactLinks = [
  { label: 'LinkedIn', href: '#linkedin', text: 'in' },
  { label: 'GitHub', href: '#github', icon: 'github' },
  { label: 'Google', href: '#google', text: 'G' },
]

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 fill-current sm:size-[18px]"
    >
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.52 2.87 8.35 6.84 9.7.5.09.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.94c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92v2.8c0 .27.18.58.69.48A10.26 10.26 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 bg-[#f8f7f4] py-10">
      <Container className="flex flex-col items-center gap-6 text-center text-neutral-900 sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center justify-center gap-4">
          <span className="text-base font-semibold">Get in touch</span>
          <div className="flex items-center gap-3">
            {contactLinks.map(({ label, href, text, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={footerClasses.contactIcon}
              >
                {icon === 'github' ? <GitHubIcon /> : text}
              </a>
            ))}
          </div>
        </div>

        <a href="/" className="text-base font-semibold underline underline-offset-2 hover:text-neutral-700 sm:text-lg">
          Home page
        </a>
      </Container>
    </footer>
  )
}
