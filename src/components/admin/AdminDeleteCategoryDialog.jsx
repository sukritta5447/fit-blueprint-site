import { useState } from "react";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminDeleteCategoryDialog({
  categoryName,
  articleCount,
  replacementOptions,
  onCancel,
  onConfirm,
}) {
  const [replacementCategory, setReplacementCategory] = useState(
    replacementOptions[0] || "",
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-5">
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-[#eeece9] px-8 py-12 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
        aria-describedby="delete-category-description"
      >
        <button
          type="button"
          className="absolute right-6 top-5 text-neutral-500 transition hover:text-neutral-950"
          aria-label="Close delete category confirmation"
          onClick={onCancel}
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        <h2
          id="delete-category-title"
          className="text-2xl font-semibold tracking-tight text-neutral-950"
        >
          Delete category
        </h2>
        <p
          id="delete-category-description"
          className="mt-6 text-sm font-medium text-neutral-500"
        >
          Do you want to delete this category?
          {articleCount > 0 &&
            ` ${articleCount} article(s) use "${categoryName}". Choose a replacement.`}
        </p>

        {articleCount > 0 && replacementOptions.length > 0 && (
          <div className="mt-6 space-y-2 text-left">
            <label className="text-sm font-medium text-neutral-500">
              Move articles to
            </label>
            <Select
              value={replacementCategory}
              onValueChange={setReplacementCategory}
            >
              <SelectTrigger className="h-11 rounded-md border-stone-300 bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {replacementOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            className="min-w-28 rounded-full border border-neutral-400 bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-stone-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="min-w-28 rounded-full bg-neutral-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            onClick={() => onConfirm(replacementCategory)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
