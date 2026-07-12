import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import { categories } from '../data/articles'
import { articleSectionClasses, searchFieldStyles } from '@/styles/articleSection.styles'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

function SearchField({ variant = 'desktop', value, onChange, results = [] }) {
  const styles = searchFieldStyles[variant]
  const shouldShowResults = value.trim() && results.length > 0

  return (
    <div className={styles.wrapper}>
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

      {shouldShowResults && (
        <div className={styles.results}>
          {results.slice(0, 6).map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className={styles.resultLink}
            >
              {article.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryTab({ category, isActive, onSelectCategory }) {
  const stateClasses = isActive
    ? 'bg-neutral-300 text-neutral-950 shadow-sm disabled:opacity-100'
    : 'text-neutral-500 hover:bg-white/70 hover:text-neutral-900'

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

export function ArticleSection({
  selectedCategory,
  onSelectCategory,
  searchKeyword,
  onSearchKeywordChange,
  searchResults = [],
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
            results={searchResults}
          />
        </div>

        <div className="space-y-7 md:hidden">
          <SearchField
            variant="mobile"
            value={searchKeyword}
            onChange={onSearchKeywordChange}
            results={searchResults}
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
