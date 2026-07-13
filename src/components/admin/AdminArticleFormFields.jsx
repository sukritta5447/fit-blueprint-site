import { ImageIcon, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminArticleFormPageClasses } from "@/styles/adminArticleFormPage.styles";
import { cn } from "@/utils/utils";

function ThumbnailField({ image, onUploadClick, fileInputRef, onFileChange }) {
  return (
    <div className={adminArticleFormPageClasses.fieldGroup}>
      <span className={adminArticleFormPageClasses.label}>Thumbnail image</span>
      <div className={adminArticleFormPageClasses.thumbnailRow}>
        <div className={adminArticleFormPageClasses.thumbnailPreview}>
          {image ? (
            <img
              src={image}
              alt="Article thumbnail preview"
              className={adminArticleFormPageClasses.thumbnailImage}
            />
          ) : (
            <ImageIcon
              size={32}
              strokeWidth={1.4}
              className={adminArticleFormPageClasses.thumbnailPlaceholder}
            />
          )}
        </div>

        <div className="pb-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            className={adminArticleFormPageClasses.outlineButton}
            onClick={onUploadClick}
          >
            Upload thumbnail image
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminArticleFormFields({
  categories,
  fileInputRef,
  formErrors,
  formValues,
  isEditing,
  onCategoryChange,
  onDeleteClick,
  onInputChange,
  onThumbnailChange,
  onUploadClick,
}) {
  return (
    <>
      <ThumbnailField
        image={formValues.image}
        onUploadClick={onUploadClick}
        fileInputRef={fileInputRef}
        onFileChange={onThumbnailChange}
      />
      {formErrors.image && (
        <p className={adminArticleFormPageClasses.errorText}>
          {formErrors.image}
        </p>
      )}

      <div
        className={cn(
          adminArticleFormPageClasses.fieldGroup,
          adminArticleFormPageClasses.narrowField,
        )}
      >
        <label className={adminArticleFormPageClasses.label}>Category</label>
        <Select value={formValues.category} onValueChange={onCategoryChange}>
          <SelectTrigger className={adminArticleFormPageClasses.input}>
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
        {formErrors.category && (
          <p className={adminArticleFormPageClasses.errorText}>
            {formErrors.category}
          </p>
        )}
      </div>

      <div
        className={cn(
          adminArticleFormPageClasses.fieldGroup,
          adminArticleFormPageClasses.narrowField,
        )}
      >
        <label
          htmlFor="article-author"
          className={adminArticleFormPageClasses.label}
        >
          Author name
        </label>
        <Input
          id="article-author"
          name="author"
          value={formValues.author}
          readOnly
          className={adminArticleFormPageClasses.authorInput}
        />
      </div>

      <div
        className={cn(
          adminArticleFormPageClasses.fieldGroup,
          adminArticleFormPageClasses.fullField,
        )}
      >
        <label htmlFor="article-title" className={adminArticleFormPageClasses.label}>
          Title
        </label>
        <Input
          id="article-title"
          name="title"
          placeholder="Article title"
          value={formValues.title}
          onChange={onInputChange}
          className={adminArticleFormPageClasses.input}
        />
        {formErrors.title && (
          <p className={adminArticleFormPageClasses.errorText}>
            {formErrors.title}
          </p>
        )}
      </div>

      <div
        className={cn(
          adminArticleFormPageClasses.fieldGroup,
          adminArticleFormPageClasses.fullField,
        )}
      >
        <label
          htmlFor="article-excerpt"
          className={adminArticleFormPageClasses.label}
        >
          Introduction (max 120 letters)
        </label>
        <textarea
          id="article-excerpt"
          name="excerpt"
          placeholder="Introduction"
          value={formValues.excerpt}
          onChange={onInputChange}
          className={cn(
            adminArticleFormPageClasses.textarea,
            adminArticleFormPageClasses.introTextarea,
          )}
        />
        {formErrors.excerpt && (
          <p className={adminArticleFormPageClasses.errorText}>
            {formErrors.excerpt}
          </p>
        )}
      </div>

      <div
        className={cn(
          adminArticleFormPageClasses.fieldGroup,
          adminArticleFormPageClasses.fullField,
        )}
      >
        <label
          htmlFor="article-content"
          className={adminArticleFormPageClasses.label}
        >
          Content
        </label>
        <textarea
          id="article-content"
          name="content"
          placeholder="Content"
          value={formValues.content}
          onChange={onInputChange}
          className={cn(
            adminArticleFormPageClasses.textarea,
            adminArticleFormPageClasses.contentTextarea,
          )}
        />
        {formErrors.content && (
          <p className={adminArticleFormPageClasses.errorText}>
            {formErrors.content}
          </p>
        )}
      </div>

      {isEditing && (
        <button
          type="button"
          className={adminArticleFormPageClasses.deleteButton}
          onClick={onDeleteClick}
        >
          <Trash2 size={16} strokeWidth={1.8} />
          Delete article
        </button>
      )}
    </>
  );
}
