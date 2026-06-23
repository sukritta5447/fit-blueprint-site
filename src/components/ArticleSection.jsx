import { ChevronDown, Search } from 'lucide-react'

import { categories } from '../data/articles'
import { Input } from './ui/input'

function ArticleSection() {
  return (
    <section className="pt-6">
      <h2 className="text-[2rem] font-black tracking-tight text-neutral-900 md:text-2xl">
        Latest articles
      </h2>

      <div className="mt-8 rounded-none bg-[#eeece9] px-5 py-6 md:mt-6 md:rounded-xl md:p-3">
        <div className="hidden items-center justify-between gap-6 md:flex">
          <div className="flex items-center gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`rounded-md px-5 py-3 text-sm font-semibold transition ${
                  index === 0
                    ? 'bg-neutral-200 text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:bg-white hover:text-neutral-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="relative block w-80">
            <span className="sr-only">Search articles</span>
            <Input
              type="search"
              placeholder="Search"
              className="h-10 rounded-md border-stone-200 bg-white pl-4 pr-10 text-sm shadow-none placeholder:text-neutral-500"
            />
            <Search
              aria-hidden="true"
              className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
              strokeWidth={1.8}
            />
          </label>
        </div>

        <div className="space-y-7 md:hidden">
          <label className="relative block">
            <span className="sr-only">Search articles</span>
            <Input
              type="search"
              placeholder="Search"
              className="h-[76px] rounded-xl border-stone-300 bg-white pl-6 pr-14 text-3xl font-semibold shadow-none placeholder:text-neutral-500"
            />
            <Search
              aria-hidden="true"
              className="absolute right-6 top-1/2 size-8 -translate-y-1/2 text-neutral-900"
              strokeWidth={1.5}
            />
          </label>

          <div>
            <p className="mb-3 text-2xl font-black tracking-tight text-neutral-500">Category</p>
            <button
              type="button"
              className="flex h-[76px] w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-6 text-3xl font-semibold text-neutral-500"
            >
              <span>Highlight</span>
              <ChevronDown aria-hidden="true" className="size-8 text-neutral-900" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArticleSection
