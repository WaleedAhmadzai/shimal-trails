// Small wrapper around localStorage. Reading never throws: corrupted or
// blocked storage returns the fallback and reports what happened.

export const STORAGE_KEYS = {
  plan: 'shimal.plan.v1',
  lastBooking: 'shimal.lastBooking.v1',
  demo: 'shimal.demo.v1',
};

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { value: fallback, error: null };
    return { value: JSON.parse(raw), error: null };
  } catch (error) {
    return { value: fallback, error };
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Storage can be full or disabled (private mode). The app keeps working
    // from React state; the selection just will not survive a reload.
    return false;
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
