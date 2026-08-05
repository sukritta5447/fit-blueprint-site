import { AdminArticleFormFields } from "@/components/admin/AdminArticleFormFields";
import { AdminDeleteArticleDialog } from "@/components/admin/AdminDeleteArticleDialog";
import { useAdminArticleForm } from "@/hooks/useAdminArticleForm";
import { adminArticleFormPageClasses } from "@/styles/adminArticleFormPage.styles";

export function AdminArticleFormPage() {
  const {
    categories,
    existingArticle,
    fileInputRef,
    formErrors,
    formValues,
    isDeleteOpen,
    isEditing,
    isLoading,
    isSaving,
    isUploading,
    handleCategoryChange,
    handleDeleteConfirm,
    handleInputChange,
    handleSaveDraft,
    handleSavePublish,
    handleThumbnailChange,
    handleUploadClick,
    setIsDeleteOpen,
  } = useAdminArticleForm();

  if (isLoading || (isEditing && !existingArticle)) {
    return <p className="p-8 text-sm text-neutral-500">Loading article...</p>;
  }

  return (
    <div className={adminArticleFormPageClasses.page}>
      <header className={adminArticleFormPageClasses.header}>
        <h1 className={adminArticleFormPageClasses.title}>
          {isEditing ? "Edit article" : "Create article"}
        </h1>

        <div className={adminArticleFormPageClasses.headerActions}>
          <button
            type="button"
            disabled={isSaving || isUploading}
            className={adminArticleFormPageClasses.outlineButton}
            onClick={handleSaveDraft}
          >
            Save as draft
          </button>
          <button
            type="button"
            disabled={isSaving || isUploading}
            className={adminArticleFormPageClasses.primaryButton}
            onClick={handleSavePublish}
          >
            {isEditing ? "Save" : "Save and publish"}
          </button>
        </div>
      </header>

      <form
        className={adminArticleFormPageClasses.form}
        onSubmit={(event) => event.preventDefault()}
      >
        <AdminArticleFormFields
          categories={categories}
          fileInputRef={fileInputRef}
          formErrors={formErrors}
          formValues={formValues}
          isEditing={isEditing}
          isUploading={isUploading}
          onCategoryChange={handleCategoryChange}
          onDeleteClick={() => setIsDeleteOpen(true)}
          onInputChange={handleInputChange}
          onThumbnailChange={handleThumbnailChange}
          onUploadClick={handleUploadClick}
        />
      </form>

      {isDeleteOpen && (
        <AdminDeleteArticleDialog
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
