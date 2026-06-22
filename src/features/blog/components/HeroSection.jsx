import { featuredAuthor } from '../../../data/articles'

export function HeroSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_330px_1fr] md:gap-12">
        <div className="text-center md:text-right">
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.08em] text-neutral-950 sm:text-6xl lg:text-7xl">
            Stay
            <br />
            Informed,
            <br />
            Stay Inspired
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-neutral-600 md:ml-auto md:mr-0">
            Discover a world of knowledge at Your Fingertips. Your daily dose of
            inspiration and information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-stone-200 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Author enjoying a sunny day outdoors"
            className="h-[420px] w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-sm text-center md:text-left">
          <p className="text-xs font-semibold text-neutral-500">{featuredAuthor.role}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
            {featuredAuthor.name}
          </h2>
          <p className="mt-4 text-sm leading-6 text-neutral-600">{featuredAuthor.bio}</p>
          <p className="mt-5 text-sm leading-6 text-neutral-700">{featuredAuthor.note}</p>
        </div>
      </div>
    </section>
  )
}
