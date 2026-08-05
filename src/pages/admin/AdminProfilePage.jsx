import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getApiErrorMessage } from "@/services/apiClient";
import {
  getAdminProfile,
  updateAdminProfile,
} from "@/services/adminProfileService";
import { uploadImage } from "@/services/uploadService";
import { adminProfilePageClasses } from "@/styles/adminProfilePage.styles";

const BIO_MAX_LENGTH = 120;

function ProfileAvatar({ image, name }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={adminProfilePageClasses.avatar}
      />
    );
  }

  return (
    <span className={adminProfilePageClasses.avatarFallback} aria-hidden="true">
      <User size={36} strokeWidth={1.6} />
    </span>
  );
}

function getInitialFormValues(adminProfile) {
  return {
    name: adminProfile?.name || "",
    username: adminProfile?.username || "",
    email: adminProfile?.email || "",
    bio: adminProfile?.bio || "",
    image: adminProfile?.image || "",
  };
}

export function AdminProfilePage() {
  const fileInputRef = useRef(null);
  const { currentUser } = useMemberAuth();
  const [formValues, setFormValues] = useState(() =>
    getInitialFormValues(currentUser),
  );
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadProfile() {
      try {
        const profile = await getAdminProfile();
        if (shouldUpdate) setFormValues(getInitialFormValues(profile));
      } catch (error) {
        toast.error("Unable to load profile", {
          description: getApiErrorMessage(error),
        });
      } finally {
        if (shouldUpdate) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      shouldUpdate = false;
    };
  }, []);

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

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleProfilePictureChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file, "avatar");
      setFormValues((values) => ({
        ...values,
        image: imageUrl,
      }));
      toast.success("Profile picture uploaded");
    } catch (error) {
      toast.error("Unable to upload profile picture", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function validateForm() {
    const errors = {};

    if (!formValues.name.trim()) errors.name = "Name is required";
    if (!formValues.username.trim()) errors.username = "Username is required";
    if (!formValues.email.trim()) errors.email = "Email is required";
    if (formValues.bio.trim().length > BIO_MAX_LENGTH) {
      errors.bio = `Bio must be ${BIO_MAX_LENGTH} letters or fewer`;
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSaving(true);
      const updatedAdmin = await updateAdminProfile({
        name: formValues.name,
        username: formValues.username,
        bio: formValues.bio,
        image: formValues.image,
      });

      setFormValues(getInitialFormValues(updatedAdmin));
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast.error("Unable to save profile", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="p-8 text-sm text-neutral-500">Loading profile...</p>;
  }

  return (
    <div className={adminProfilePageClasses.page}>
      <header className={adminProfilePageClasses.header}>
        <h1 className={adminProfilePageClasses.title}>Profile</h1>
        <button
          type="submit"
          disabled={isSaving || isUploading}
          form="admin-profile-form"
          className={adminProfilePageClasses.saveButton}
        >
          Save
        </button>
      </header>

      <form
        id="admin-profile-form"
        className={adminProfilePageClasses.form}
        onSubmit={handleSubmit}
      >
        <div className={adminProfilePageClasses.avatarSection}>
          <ProfileAvatar
            image={formValues.image}
            name={formValues.name || formValues.email}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleProfilePictureChange}
          />
          <button
            type="button"
            disabled={isUploading}
            className={adminProfilePageClasses.uploadButton}
            onClick={handleUploadClick}
          >
            {isUploading ? "Uploading..." : "Upload profile picture"}
          </button>
        </div>

        <div className={adminProfilePageClasses.divider} />

        <div className={adminProfilePageClasses.fields}>
          <div className={adminProfilePageClasses.fieldGroup}>
            <label htmlFor="admin-profile-name" className={adminProfilePageClasses.label}>
              Name
            </label>
            <Input
              id="admin-profile-name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              className={adminProfilePageClasses.input}
            />
            {formErrors.name && (
              <p className={adminProfilePageClasses.errorText}>{formErrors.name}</p>
            )}
          </div>

          <div className={adminProfilePageClasses.fieldGroup}>
            <label
              htmlFor="admin-profile-username"
              className={adminProfilePageClasses.label}
            >
              Username
            </label>
            <Input
              id="admin-profile-username"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              className={adminProfilePageClasses.input}
            />
            {formErrors.username && (
              <p className={adminProfilePageClasses.errorText}>
                {formErrors.username}
              </p>
            )}
          </div>

          <div className={adminProfilePageClasses.fieldGroup}>
            <label htmlFor="admin-profile-email" className={adminProfilePageClasses.label}>
              Email
            </label>
            <Input
              id="admin-profile-email"
              name="email"
              type="email"
              value={formValues.email}
              readOnly
              className={adminProfilePageClasses.input}
            />
            {formErrors.email && (
              <p className={adminProfilePageClasses.errorText}>{formErrors.email}</p>
            )}
          </div>
        </div>

        <div className={`${adminProfilePageClasses.bioFieldGroup} mt-6`}>
          <label htmlFor="admin-profile-bio" className={adminProfilePageClasses.label}>
            Bio (max 120 letters)
          </label>
          <textarea
            id="admin-profile-bio"
            name="bio"
            value={formValues.bio}
            onChange={handleInputChange}
            className={adminProfilePageClasses.textarea}
          />
          {formErrors.bio && (
            <p className={adminProfilePageClasses.errorText}>{formErrors.bio}</p>
          )}
        </div>
      </form>
    </div>
  );
}
