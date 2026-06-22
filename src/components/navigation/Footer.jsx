import { Container } from '../common/Container'

const socials = ['x', 'ig', 'fb']

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-100 py-12">
      <Container className="flex flex-col gap-8 text-sm text-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span>Get in touch</span>
          <div className="flex items-center gap-2">
            {socials.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="grid size-7 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold uppercase text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <a href="mailto:hello@example.com" className="hover:text-neutral-950 hover:underline">
          hh@example.com
        </a>
      </Container>
    </footer>
  )
}
