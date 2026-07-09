import { Search } from 'lucide-react'

import { categories } from '../data/articles'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const articleSectionClasses = {
  title: 'text-2xl font-semibold tracking-tight text-neutral-900 md:text-2xl',
  panel:
    'mt-6 -mx-5 rounded-none bg-[#eeece9] px-5 py-5 md:mx-0 md:mt-6 md:rounded-xl md:p-3',
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
      'h-12 rounded-xl border-stone-300 bg-white pl-5 pr-12 text-sm shadow-none placeholder:text-neutral-500',
    icon: 'absolute right-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500',
    strokeWidth: 1.8,
  },
}

function SearchField({ variant = 'desktop', value, onChange }) {
  const styles = searchFieldStyles[variant]

  return (
    <label className={styles.label}>
      <span className="sr-only">Search articles</span>
      <Input
        type="search"
        placeholder="Search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

function CategoryTab({ category, isActive, onSelectCategory }) {
  let stateClasses =
    'text-neutral-500 hover:bg-white/70 hover:text-neutral-900'

  if (isActive) {
    stateClasses = 'bg-neutral-300 text-neutral-950 shadow-sm disabled:opacity-100'
  }

  return (
    <button
      type="button"
      disabled={isActive}
      onClick={() => onSelectCategory(category)}
      className={`rounded-md px-5 py-3 text-sm font-medium transition ${stateClasses}`}
    >
      {category}
    </button>
  )
}

function CategoryTabs({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-3">
      {categories.map((category) => (
        <CategoryTab
          key={category}
          category={category}
          isActive={category === selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  )
}

function MobileCategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-500">
        Category
      </p>
      <Select
        value={selectedCategory}
        onValueChange={onSelectCategory}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ArticleSection({
  selectedCategory,
  onSelectCategory,
  searchKeyword,
  onSearchKeywordChange,
}) {
  return (
    <section className="pt-6">
      <h2 className={articleSectionClasses.title}>Latest articles</h2>

      <div className={articleSectionClasses.panel}>
        <div className="hidden items-center justify-between gap-6 md:flex">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
          <SearchField
            value={searchKeyword}
            onChange={onSearchKeywordChange}
          />
        </div>

        <div className="space-y-7 md:hidden">
          <SearchField
            variant="mobile"
            value={searchKeyword}
            onChange={onSearchKeywordChange}
          />
          <MobileCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    </section>
  )
}

export default ArticleSection
