import { useEffect, useRef, useState } from "react";
import { RotateCcw, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { Input } from "@/components/ui/input";
import {
  getCurrentUser,
  updateCurrentUserProfile,
} from "@/services/memberAuthStorage";

function ProfileAvatar({ image, name, className = "size-24" }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} grid place-items-center rounded-full bg-[#706d66] text-white`}
      aria-hidden="true"
    >
      <User size={36} strokeWidth={1.6} />
    </span>
  );
}

export function MemberProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [formValues, setFormValues] = useState(() => ({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    image: currentUser?.image || "",
  }));

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", {
        replace: true,
        state: { from: "/member-management" },
      });
    }
  }, [currentUser, navigate]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((values) => ({
      ...values,
      [name]: value,
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

  function handleDeleteProfilePicture() {
    setFormValues((values) => ({
      ...values,
      image: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const updatedUser = updateCurrentUserProfile({
      name: formValues.name.trim(),
      username: formValues.username.trim(),
      image: formValues.image,
    });

    if (!updatedUser) return;

    setCurrentUser(updatedUser);
    setFormValues((values) => ({
      ...values,
      name: updatedUser.name,
      username: updatedUser.username,
      image: updatedUser.image,
    }));
    toast.success("Saved profile", {
      description: "Your profile has been successfully updated",
    });
  }

  if (!currentUser) return null;

  return (
    <PageShell>
      <main>
        <Container className="py-9 md:py-12">
          <section
            className="mx-auto w-full max-w-[720px]"
            aria-labelledby="member-profile-title"
          >
            <div className="flex items-center gap-4">
              <ProfileAvatar
                image={formValues.image}
                name={
                  formValues.name || formValues.username || formValues.email
                }
                className="size-14"
              />
              <div className="flex flex-wrap items-center gap-3 text-xl font-semibold tracking-tight md:text-2xl">
                <span className="text-neutral-500">{formValues.name}</span>
                <span className="h-6 w-px bg-neutral-300" aria-hidden="true" />
                <h1 id="member-profile-title" className="text-neutral-950">
                  Profile
                </h1>
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[150px_1fr]">
              <aside aria-label="Member settings">
                <nav className="space-y-5 text-sm font-medium">
                  <a
                    href="#member-profile-form"
                    className="flex items-center gap-3 text-neutral-800"
                  >
                    <User size={16} strokeWidth={1.7} />
                    <span>Profile</span>
                  </a>
                  <Link
                    to="/reset-password"
                    className="flex items-center gap-3 text-neutral-300"
                  >
                    <RotateCcw size={16} strokeWidth={1.7} />
                    <span>Reset password</span>
                  </Link>
                </nav>
              </aside>

              <form
                id="member-profile-form"
                className="rounded-2xl bg-[#eeece9] px-8 py-8 md:px-9 md:py-9"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <ProfileAvatar
                    image={formValues.image}
                    name={
                      formValues.name || formValues.username || formValues.email
                    }
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleProfilePictureChange}
                  />
                  <div className="flex flex-col items-start gap-2">
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-500 bg-white px-8 text-sm font-semibold text-neutral-900 transition hover:bg-stone-50"
                      onClick={handleUploadClick}
                    >
                      Upload profile picture
                    </button>
                    {formValues.image && (
                      <button
                        type="button"
                        className="px-1 ml-5 text-xs font-semibold text-red-600 transition hover:text-red-700 hover:underline"
                        onClick={handleDeleteProfilePicture}
                      >
                        Delete profile picture
                      </button>
                    )}
                  </div>
                </div>

                <div className="my-8 h-px bg-neutral-300" />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="member-profile-name"
                      className="block text-sm font-medium text-neutral-500"
                    >
                      Name
                    </label>
                    <Input
                      id="member-profile-name"
                      name="name"
                      value={formValues.name}
                      className="h-11 rounded-md border-stone-300 bg-white px-4 text-sm shadow-none focus-visible:ring-neutral-300"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="member-profile-username"
                      className="block text-sm font-medium text-neutral-500"
                    >
                      Username
                    </label>
                    <Input
                      id="member-profile-username"
                      name="username"
                      value={formValues.username}
                      className="h-11 rounded-md border-stone-300 bg-white px-4 text-sm shadow-none focus-visible:ring-neutral-300"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-neutral-300">
                      Email
                    </span>
                    <p className="px-4 text-sm font-medium text-neutral-300">
                      {formValues.email}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-9 inline-flex min-w-24 justify-center rounded-full bg-neutral-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Save
                </button>
              </form>
            </div>
          </section>
        </Container>
      </main>
    </PageShell>
  );
}
