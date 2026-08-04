const MEMBER_PROGRAMS_STORAGE_KEY = "jb-fit-blueprint-member-programs";

function getStoredPrograms() {
  try {
    const programs = localStorage.getItem(MEMBER_PROGRAMS_STORAGE_KEY);
    return programs ? JSON.parse(programs) : {};
  } catch (error) {
    console.error("Error reading member programs:", error);
    return {};
  }
}

export function getMemberProgram(email) {
  if (!email) return null;

  return getStoredPrograms()[email.toLowerCase()] || null;
}

export function saveMemberProgram(email, program) {
  if (!email) return null;

  const programs = getStoredPrograms();
  const savedProgram = {
    ...program,
    calculatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    MEMBER_PROGRAMS_STORAGE_KEY,
    JSON.stringify({
      ...programs,
      [email.toLowerCase()]: savedProgram,
    }),
  );

  return savedProgram;
}
