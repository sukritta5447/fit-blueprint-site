import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  CURRENT_ADMIN_UPDATED_EVENT,
  getCurrentAdmin,
  getCurrentAdminProfile,
  updateCurrentAdminProfile,
} from "@/services/adminAuthStorage";
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
  const [currentAdmin, setCurrentAdminState] = useState(() => getCurrentAdmin());
  const [formValues, setFormValues] = useState(() =>
    getInitialFormValues(getCurrentAdminProfile()),
  );
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    function syncAdminState() {
      const admin = getCurrentAdmin();
      setCurrentAdminState(admin);
      setFormValues(getInitialFormValues(getCurrentAdminProfile()));
    }

    window.addEventListener(CURRENT_ADMIN_UPDATED_EVENT, syncAdminState);

    return () => {
      window.removeEventListener(CURRENT_ADMIN_UPDATED_EVENT, syncAdminState);
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

  function handleProfilePictureChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setFormValues((values) => ({
        ...values,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
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
      const updatedAdmin = await updateCurrentAdminProfile({
        name: formValues.name,
        username: formValues.username,
        email: formValues.email,
        bio: formValues.bio,
        image: formValues.image,
      });

      if (!updatedAdmin) return;

      setCurrentAdminState(updatedAdmin);
      setFormValues(getInitialFormValues(updatedAdmin));
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast.error("Unable to save profile", {
        description: error.message,
      });
    }
  }

  if (!currentAdmin) return null;

  return (
    <div className={adminProfilePageClasses.page}>
      <header className={adminProfilePageClasses.header}>
        <h1 className={adminProfilePageClasses.title}>Profile</h1>
        <button
          type="submit"
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
            className={adminProfilePageClasses.uploadButton}
            onClick={handleUploadClick}
          >
            Upload profile picture
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
              onChange={handleInputChange}
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
