import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useMemberAuth } from "@/hooks/useMemberAuth";
import {
  createAdminArticle,
  deleteAdminArticle,
  getAdminArticle,
  getAdminCategories,
  getPostStatuses,
  updateAdminArticle,
} from "@/services/adminContentService";
import { getApiErrorMessage } from "@/services/apiClient";
import { uploadImage } from "@/services/uploadService";

const INTRODUCTION_MAX_LENGTH = 120;

function createSlug(title) {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `post-${Date.now()}`;
}

function getInitialFormValues(article, authorName) {
  return {
    author: authorName || "Admin",
    categoryId: article?.categoryId || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    image: article?.image || "",
    title: article?.title || "",
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
  if (!formValues.categoryId) errors.category = "Category is required";
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
  const { currentUser } = useMemberAuth();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [existingArticle, setExistingArticle] = useState(null);
  const [formValues, setFormValues] = useState(() =>
    getInitialFormValues(null, currentUser?.name),
  );
  const [formErrors, setFormErrors] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadFormData() {
      setIsLoading(true);

      try {
        const [nextCategories, nextStatuses, article] = await Promise.all([
          getAdminCategories(),
          getPostStatuses(),
          isEditing ? getAdminArticle(id) : Promise.resolve(null),
        ]);

        if (!shouldUpdate) return;

        setCategories(nextCategories);
        setStatuses(nextStatuses);
        setExistingArticle(article);
        setFormValues(getInitialFormValues(article, currentUser?.name));
      } catch (error) {
        toast.error("Unable to load article form", {
          description: getApiErrorMessage(error),
        });

        if (isEditing) navigate("/admin/articles", { replace: true });
      } finally {
        if (shouldUpdate) setIsLoading(false);
      }
    }

    loadFormData();

    return () => {
      shouldUpdate = false;
    };
  }, [currentUser?.name, id, isEditing, navigate]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((values) => ({ ...values, [name]: value }));
    setFormErrors((errors) => ({ ...errors, [name]: "" }));
  }

  function handleCategoryChange(value) {
    setFormValues((values) => ({ ...values, categoryId: value }));
    setFormErrors((errors) => ({ ...errors, category: "" }));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleThumbnailChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file, "post-image");
      setFormValues((values) => ({ ...values, image: imageUrl }));
      setFormErrors((errors) => ({ ...errors, image: "" }));
      toast.success("Thumbnail uploaded");
    } catch (error) {
      toast.error("Unable to upload thumbnail", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function saveArticle(status) {
    const errors = validateArticleForm(formValues);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const selectedStatus = statuses.find((item) => item.status === status);

    if (!selectedStatus) {
      toast.error("Unable to save article", {
        description: `Status ${status} is not configured`,
      });
      return;
    }

    const publishedAt =
      status === "published"
        ? existingArticle?.publishedAt || new Date().toISOString()
        : null;
    const payload = {
      category_id: Number(formValues.categoryId),
      content: formValues.content.trim(),
      date: existingArticle?.isoDate || new Date().toISOString().slice(0, 10),
      description: formValues.excerpt.trim(),
      image: formValues.image,
      published_at: publishedAt,
      slug: existingArticle?.slug || createSlug(formValues.title),
      status_id: selectedStatus.id,
      title: formValues.title.trim(),
    };

    setIsSaving(true);

    try {
      if (isEditing) {
        await updateAdminArticle(id, payload);
      } else {
        await createAdminArticle(payload);
      }

      const toastMessage = getArticleSaveToast(status, isEditing);
      toast.success(toastMessage.title, {
        description: toastMessage.description,
      });
      navigate("/admin/articles");
    } catch (error) {
      toast.error("Unable to save article", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!existingArticle) return;

    setIsSaving(true);

    try {
      await deleteAdminArticle(existingArticle.id);
      toast.success("Article deleted");
      setIsDeleteOpen(false);
      navigate("/admin/articles");
    } catch (error) {
      toast.error("Unable to delete article", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    categories,
    existingArticle,
    fileInputRef,
    formErrors,
    formValues,
    handleCategoryChange,
    handleDeleteConfirm,
    handleInputChange,
    handleSaveDraft: () => saveArticle("draft"),
    handleSavePublish: () => saveArticle("published"),
    handleThumbnailChange,
    handleUploadClick,
    isDeleteOpen,
    isEditing,
    isLoading,
    isSaving,
    isUploading,
    setIsDeleteOpen,
  };
}
