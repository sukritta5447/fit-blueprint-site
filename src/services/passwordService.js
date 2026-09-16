export async function updatePassword(auth, email, passwordValues) {
  const { error: signInError } = await auth.signInWithPassword({
    email,
    password: passwordValues.currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Current password is incorrect" };
  }

  const { error: updateError } = await auth.updateUser({
    password: passwordValues.newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}
