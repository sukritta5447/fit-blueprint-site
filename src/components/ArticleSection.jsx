import { ChevronDown, Search } from 'lucide-react'

import { categories } from '../data/articles'
import { Input } from './ui/input'

const articleSectionClasses = {
  title: 'text-[2rem] font-semibold tracking-tight text-neutral-900 md:text-2xl',
  panel:
    'mt-8 rounded-none bg-[#eeece9] px-5 py-6 md:mt-6 md:rounded-xl md:p-3',
  mobileCategoryButton:
    'flex h-[76px] w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-6 text-3xl font-medium text-neutral-500',
}

const searchFieldStyles = {
  desktop: {
    label: 'relative block w-80',
    input:
      'h-10 rounded-md border-stone-200 bg-white pl-4 pr-10 text-sm shadow-none placeholder:text-neutral-500',
    icon: 'absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500',
    strokeWidth: 1.8,
  },
  mobile: {
    label: 'relative block',
    input:
      'h-[76px] rounded-xl border-stone-300 bg-white pl-6 pr-14 text-3xl font-medium shadow-none placeholder:text-neutral-500',
    icon: 'absolute right-6 top-1/2 size-8 -translate-y-1/2 text-neutral-900',
    strokeWidth: 1.5,
  },
}

function SearchField({ variant = 'desktop' }) {
  const styles = searchFieldStyles[variant]

  return (
    <label className={styles.label}>
      <span className="sr-only">Search articles</span>
      <Input
        type="search"
        placeholder="Search"
        className={styles.input}
      />
      <Search
        aria-hidden="true"
        className={styles.icon}
        strokeWidth={styles.strokeWidth}
      />
    </label>
  )
}

function CategoryTab({ category, isActive }) {
  let stateClasses = 'text-neutral-500 hover:bg-white hover:text-neutral-900'

  if (isActive) {
    stateClasses = 'bg-neutral-200 text-neutral-900 shadow-sm'
  }

  return (
    <button
      type="button"
      className={`rounded-md px-5 py-3 text-sm font-medium transition ${stateClasses}`}
    >
      {category}
    </button>
  )
}

function CategoryTabs() {
  return (
    <div className="flex items-center gap-3">
      {categories.map((category, index) => (
        <CategoryTab
          key={category}
          category={category}
          isActive={index === 0}
        />
      ))}
    </div>
  )
}

function MobileCategoryFilter() {
  return (
    <div>
      <p className="mb-3 text-2xl font-semibold tracking-tight text-neutral-500">
        Category
      </p>
      <button
        type="button"
        className={articleSectionClasses.mobileCategoryButton}
      >
        <span>{categories[0]}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-8 text-neutral-900"
          strokeWidth={1.5}
        />
      </button>
    </div>
  )
}

function ArticleSection() {
  return (
    <section className="pt-6">
      <h2 className={articleSectionClasses.title}>Latest articles</h2>

      <div className={articleSectionClasses.panel}>
        <div className="hidden items-center justify-between gap-6 md:flex">
          <CategoryTabs />
          <SearchField />
        </div>

        <div className="space-y-7 md:hidden">
          <SearchField variant="mobile" />
          <MobileCategoryFilter />
        </div>
      </div>
    </section>
  )
}

export default ArticleSection
