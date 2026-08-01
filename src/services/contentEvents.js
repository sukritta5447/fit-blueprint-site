export const CONTENT_UPDATED_EVENT =
  "jb-fit-blueprint-admin-content-updated";

export function dispatchContentUpdated() {
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
}
