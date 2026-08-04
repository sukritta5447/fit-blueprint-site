import { Camera, RotateCcw, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { Input } from "@/components/ui/input";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { updateCurrentUserProfile } from "@/services/memberAuthStorage";

const inputClass = "h-12 rounded-xl border-violet-500/20 bg-[#0b0913] px-4 text-white shadow-none";

export function MemberProfilePage() {
  const navigate = useNavigate();
  const { currentUser, isAuthLoading } = useMemberAuth();

  useEffect(() => {
    if (!isAuthLoading && !currentUser) navigate("/login", { replace: true, state: { from: "/member-management" } });
  }, [currentUser, isAuthLoading, navigate]);

  if (isAuthLoading || !currentUser) return null;

  return <MemberProfileContent currentUser={currentUser} />;
}

function MemberProfileContent({ currentUser }) {
  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState(() => ({ name: currentUser.name, username: currentUser.username, email: currentUser.email, image: currentUser.image }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((values) => ({ ...values, [name]: value }));
  }

  function handleProfilePictureChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormValues((values) => ({ ...values, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await updateCurrentUserProfile({ name: formValues.name.trim(), username: formValues.username.trim(), image: formValues.image });
      toast.success("Saved profile", { description: "Your profile has been successfully updated" });
    } catch (error) {
      toast.error("Unable to save profile", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell><main><Container className="py-14 md:py-20"><section className="mx-auto max-w-4xl">
      <p className="forge-kicker">Member settings</p><h1 className="mt-4 text-4xl font-semibold uppercase text-white">Your profile</h1>
      <div className="mt-9 grid gap-6 md:grid-cols-[190px_1fr]">
        <aside className="space-y-2"><a href="#member-profile-form" className="flex items-center gap-3 rounded-xl bg-violet-500/15 px-4 py-3 text-sm text-violet-300"><User size={17} /> Profile</a><Link to="/reset-password" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><RotateCcw size={17} /> Reset password</Link></aside>
        <form id="member-profile-form" className="forge-panel rounded-2xl p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-center gap-5">{formValues.image ? <img src={formValues.image} alt={formValues.name} className="size-24 rounded-full object-cover" /> : <span className="grid size-24 place-items-center rounded-full bg-violet-600 text-white"><User size={34} /></span>}<div><input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleProfilePictureChange} /><button type="button" className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 px-4 py-2.5 text-sm text-violet-300 hover:bg-violet-500/10" onClick={() => fileInputRef.current?.click()}><Camera size={16} /> Upload picture</button>{formValues.image && <button type="button" className="ml-3 text-xs text-red-400" onClick={() => setFormValues((values) => ({ ...values, image: "" }))}>Remove</button>}</div></div>
          <div className="my-8 h-px bg-violet-500/15" />
          <div className="grid gap-5"><ProfileField label="Name"><Input name="name" value={formValues.name} className={inputClass} onChange={handleInputChange} /></ProfileField><ProfileField label="Username"><Input name="username" value={formValues.username} className={inputClass} onChange={handleInputChange} /></ProfileField><ProfileField label="Email"><Input value={formValues.email} disabled className={`${inputClass} opacity-55`} /></ProfileField></div>
          <button type="submit" disabled={isSubmitting} className="mt-8 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white hover:bg-violet-500">{isSubmitting ? "Saving..." : "Save changes"}</button>
        </form>
      </div>
    </section></Container></main></PageShell>
  );
}

function ProfileField({ label, children }) {
  return <label className="space-y-2"><span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>{children}</label>;
}
