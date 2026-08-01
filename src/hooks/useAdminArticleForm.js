import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getCurrentAdmin } from "@/services/adminAuthStorage";
import {
  createArticle,
  deleteArticle,
  getStoredArticleById,
  updateArticle,
} from "@/services/articleStorage";
import { getStoredCategories } from "@/services/categoryStorage";

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

function validateArticleForm(formValues) {
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

function getArticleSaveToast(status, isEditing) {
  if (isEditing) {
    return {
      title: status === "draft" ? "Article saved as draft" : "Article published",
      description:
        status === "draft"
          ? "You can publish article later"
          : "Your article has been successfully published",
    };
  }

  return {
    title:
      status === "draft"
        ? "Create article and saved as draft"
        : "Create article and published",
    description:
      status === "draft"
        ? "You can publish article later"
        : "Your article has been successfully published",
  };
}

export function useAdminArticleForm() {
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
    const errors = validateArticleForm(formValues);

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

      const toastMessage = getArticleSaveToast(status, isEditing);
      toast.success(toastMessage.title, {
        description: toastMessage.description,
      });
      navigate("/admin/articles");
      return;
    }

    createArticle(payload);
    const toastMessage = getArticleSaveToast(status, isEditing);
    toast.success(toastMessage.title, {
      description: toastMessage.description,
    });
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

  return {
    categories,
    existingArticle,
    fileInputRef,
    formErrors,
    formValues,
    isDeleteOpen,
    isEditing,
    handleCategoryChange,
    handleDeleteConfirm,
    handleInputChange,
    handleSaveDraft,
    handleSavePublish,
    handleThumbnailChange,
    handleUploadClick,
    setIsDeleteOpen,
  };
}
