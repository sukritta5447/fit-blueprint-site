export const articleSectionClasses = {
  title: 'text-2xl font-semibold tracking-tight text-neutral-900 md:text-2xl',
  panel:
    'mt-6 -mx-5 rounded-none bg-[#eeece9] px-5 py-5 md:mx-0 md:mt-6 md:rounded-xl md:p-3',
}

export const searchFieldStyles = {
  desktop: {
    wrapper: 'relative w-80',
    input:
      'h-10 rounded-md border-stone-200 bg-white pl-4 pr-10 text-sm shadow-none placeholder:text-neutral-500',
    icon: 'absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500',
    results:
      'absolute right-0 top-[calc(100%+0.5rem)] z-20 max-h-96 w-full overflow-hidden rounded-xl bg-white py-2 text-sm shadow-lg ring-1 ring-black/5',
    resultLink:
      'block px-5 py-2.5 leading-5 text-neutral-950 transition hover:bg-[#eeece9]',
    strokeWidth: 1.8,
  },
  mobile: {
    wrapper: 'relative',
    input:
      'h-12 rounded-xl border-stone-300 bg-white pl-5 pr-12 text-sm shadow-none placeholder:text-neutral-500',
    icon: 'absolute right-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500',
    results:
      'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-80 overflow-hidden rounded-xl bg-white py-2 text-sm shadow-lg ring-1 ring-black/5',
    resultLink:
      'block px-5 py-2.5 leading-5 text-neutral-950 transition hover:bg-[#eeece9]',
    strokeWidth: 1.8,
  },
}
