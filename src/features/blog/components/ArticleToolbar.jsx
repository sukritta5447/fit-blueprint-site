import { categories } from '../../../data/articles'

export function ArticleToolbar() {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-md bg-stone-100 p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              index === 0
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:bg-white hover:text-neutral-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="relative block md:w-80">
        <span className="sr-only">Search articles</span>
        <input
          type="search"
          placeholder="Search"
          className="h-10 w-full rounded-md border border-transparent bg-white pl-4 pr-10 text-sm text-neutral-700 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300"
        />
        <svg
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </label>
    </div>
  )
}
