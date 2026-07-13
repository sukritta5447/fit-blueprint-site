import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { AdminDeleteArticleDialog } from "@/components/admin/AdminDeleteArticleDialog";
import { Input } from "@/components/ui/input";
import { getCurrentAdmin } from "@/services/adminAuthStorage";
import {
  createArticle,
  deleteArticle,
  getStoredArticleById,
  getStoredCategories,
  updateArticle,
} from "@/services/adminContentStorage";
import { adminArticleFormPageClasses } from "@/styles/adminArticleFormPage.styles";
import { cn } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INTRODUCTION_MAX_LENGTH = 120;

function getDefaultAuthorName() {
  const currentAdmin = getCurrentAdmin();
  return currentAdmin?.name || "Thompson P.";
}

function getInitialFormValues(article) {
  if (!article) {
    return {
      title: "",
      excerpt: "",
      category: "",
      author: getDefaultAuthorName(),
      image: "",
      content: "",
    };
  }

  return {
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    image: article.image,
    content: article.content,
  };
}

function validateForm(formValues) {
  const errors = {};

  if (!formValues.title.trim()) errors.title = "Title is required";
  if (!formValues.excerpt.trim()) {
    errors.excerpt = "Introduction is required";
  } else if (formValues.excerpt.trim().length > INTRODUCTION_MAX_LENGTH) {
    errors.excerpt = `Introduction must be ${INTRODUCTION_MAX_LENGTH} letters or fewer`;
  }
  if (!formValues.category) errors.category = "Category is required";
  if (!formValues.author.trim()) errors.author = "Author name is required";
  if (!formValues.content.trim()) errors.content = "Content is required";

  return errors;
}

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

export function AdminArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(id);
  const existingArticle = isEditing ? getStoredArticleById(id) : null;
  const [categories] = useState(() =>
    getStoredCategories().filter((category) => category !== "Highlight"),
  );
  const [formValues, setFormValues] = useState(() =>
    getInitialFormValues(existingArticle),
  );
  const [formErrors, setFormErrors] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (isEditing && !existingArticle) {
      navigate("/admin/articles", { replace: true });
    }
  }, [existingArticle, isEditing, navigate]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((values) => ({
      ...values,
      [name]: value,
    }));
    setFormErrors((errors) => ({
      ...errors,
      [name]: "",
    }));
  }

  function handleCategoryChange(value) {
    setFormValues((values) => ({
      ...values,
      category: value,
    }));
    setFormErrors((errors) => ({
      ...errors,
      category: "",
    }));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleThumbnailChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setFormValues((values) => ({
        ...values,
        image: reader.result,
      }));
      setFormErrors((errors) => ({
        ...errors,
        image: "",
      }));
    };

    reader.readAsDataURL(file);
  }

  function saveArticle(status) {
    const errors = validateForm(formValues);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formValues,
      status,
    };

    if (isEditing) {
      const result = updateArticle(id, payload);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(
        status === "draft" ? "Article saved as draft" : "Article published",
        {
          description:
            status === "draft"
              ? "You can publish article later"
              : "Your article has been successfully published",
        },
      );
      navigate("/admin/articles");
      return;
    }

    createArticle(payload);
    toast.success(
      status === "draft"
        ? "Create article and saved as draft"
        : "Create article and published",
      {
        description:
          status === "draft"
            ? "You can publish article later"
            : "Your article has been successfully published",
      },
    );
    navigate("/admin/articles");
  }

  function handleSaveDraft() {
    saveArticle("draft");
  }

  function handleSavePublish() {
    saveArticle("published");
  }

  function handleDeleteConfirm() {
    if (!existingArticle) return;

    const result = deleteArticle(existingArticle.id);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Article deleted");
    setIsDeleteOpen(false);
    navigate("/admin/articles");
  }

  if (isEditing && !existingArticle) return null;

  return (
    <div className={adminArticleFormPageClasses.page}>
      <header className={adminArticleFormPageClasses.header}>
        <h1 className={adminArticleFormPageClasses.title}>
          {isEditing ? "Edit article" : "Create article"}
        </h1>

        <div className={adminArticleFormPageClasses.headerActions}>
          <button
            type="button"
            className={adminArticleFormPageClasses.outlineButton}
            onClick={handleSaveDraft}
          >
            Save as draft
          </button>
          <button
            type="button"
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
        <ThumbnailField
          image={formValues.image}
          onUploadClick={handleUploadClick}
          fileInputRef={fileInputRef}
          onFileChange={handleThumbnailChange}
        />
        {formErrors.image && (
          <p className={adminArticleFormPageClasses.errorText}>{formErrors.image}</p>
        )}

        <div
          className={cn(
            adminArticleFormPageClasses.fieldGroup,
            adminArticleFormPageClasses.narrowField,
          )}
        >
          <label className={adminArticleFormPageClasses.label}>Category</label>
          <Select value={formValues.category} onValueChange={handleCategoryChange}>
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
            onChange={handleInputChange}
            className={adminArticleFormPageClasses.input}
          />
          {formErrors.title && (
            <p className={adminArticleFormPageClasses.errorText}>{formErrors.title}</p>
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={16} strokeWidth={1.8} />
            Delete article
          </button>
        )}
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
