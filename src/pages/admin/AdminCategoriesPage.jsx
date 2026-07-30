import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { AdminDeleteCategoryDialog } from "@/components/admin/AdminDeleteCategoryDialog";
import {
  createCategory,
  deleteCategory,
  getCategoryArticleCount,
  getStoredCategories,
  updateCategory,
} from "@/services/categoryStorage";
import { CONTENT_UPDATED_EVENT } from "@/services/contentEvents";
import { adminLayoutClasses } from "@/styles/adminLayout.styles";
import { cn } from "@/utils/utils";

function CategoryFormDialog({
  title,
  initialValue,
  submitLabel,
  onCancel,
  onSubmit,
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!value.trim()) {
      setError("Category name is required");
      return;
    }

    onSubmit(value);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 px-5">
      <form
        className="relative w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 shadow-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>

        <div className="mt-6 space-y-2">
          <label htmlFor="category-name" className="text-sm font-medium text-neutral-500">
            Category name
          </label>
          <Input
            id="category-name"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            className="h-11 rounded-md border-stone-300 bg-white px-4 text-sm shadow-none"
          />
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            className={adminLayoutClasses.actionButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className={adminLayoutClasses.primaryButton}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    function syncCategories() {
      setCategories(getStoredCategories());
    }

    window.addEventListener(CONTENT_UPDATED_EVENT, syncCategories);

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, syncCategories);
    };
  }, []);

  function handleCreateCategory(name) {
    const result = createCategory(name);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Category created");
    setIsCreateOpen(false);
    setCategories(getStoredCategories());
  }

  function handleUpdateCategory(name) {
    const result = updateCategory(categoryToEdit, name);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Category updated");
    setCategoryToEdit(null);
    setCategories(getStoredCategories());
  }

  function handleDeleteCategory(replacementCategory) {
    const result = deleteCategory(categoryToDelete, replacementCategory);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Category deleted");
    setCategoryToDelete(null);
    setCategories(getStoredCategories());
  }

  const editableCategories = categories.filter(
    (category) => category !== "Highlight",
  );

  return (
    <>
      <header className={adminLayoutClasses.pageHeader}>
        <h1 className={adminLayoutClasses.pageTitle}>Category management</h1>
        <button
          type="button"
          className={adminLayoutClasses.primaryButton}
          onClick={() => setIsCreateOpen(true)}
        >
          Create category
        </button>
      </header>

      <section className={adminLayoutClasses.panel}>
        {editableCategories.length === 0 ? (
          <p className={adminLayoutClasses.emptyState}>No categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={adminLayoutClasses.table}>
              <thead>
                <tr className={adminLayoutClasses.tableHead}>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Articles</th>
                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {editableCategories.map((category) => (
                  <tr key={category} className={adminLayoutClasses.tableRow}>
                    <td className="px-3 py-4 font-medium text-neutral-900">
                      {category}
                    </td>
                    <td className="px-3 py-4 text-neutral-500">
                      {getCategoryArticleCount(category)}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          className={cn(adminLayoutClasses.actionButton, "gap-2")}
                          onClick={() => setCategoryToEdit(category)}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className={cn(adminLayoutClasses.dangerButton, "gap-2")}
                          onClick={() => setCategoryToDelete(category)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs text-neutral-400">
          Highlight is a special filter category and cannot be edited or deleted.
        </p>
      </section>

      {isCreateOpen && (
        <CategoryFormDialog
          title="Create category"
          initialValue=""
          submitLabel="Create"
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={handleCreateCategory}
        />
      )}

      {categoryToEdit && (
        <CategoryFormDialog
          title="Edit category"
          initialValue={categoryToEdit}
          submitLabel="Save"
          onCancel={() => setCategoryToEdit(null)}
          onSubmit={handleUpdateCategory}
        />
      )}

      {categoryToDelete && (
        <AdminDeleteCategoryDialog
          categoryName={categoryToDelete}
          articleCount={getCategoryArticleCount(categoryToDelete)}
          replacementOptions={editableCategories.filter(
            (category) => category !== categoryToDelete,
          )}
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={handleDeleteCategory}
        />
      )}
    </>
  );
}
