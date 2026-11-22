import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON, STORAGE_KEYS } from '../services/storage.js';

const PlanContext = createContext(null);

// A plan line is one trip on one departure:
// { experienceId, departureId, travellers, addOnIds: [] }
// Only one line per trip is allowed, so experienceId identifies the line.

function isValidLine(line) {
  return (
    line &&
    typeof line.experienceId === 'string' &&
    typeof line.departureId === 'string' &&
    Number.isInteger(line.travellers) &&
    Array.isArray(line.addOnIds)
  );
}

/** Reads the saved plan once, dropping anything malformed. */
function loadSavedPlan() {
  const { value, error } = readJSON(STORAGE_KEYS.plan, []);
  if (error || !Array.isArray(value)) {
    return { lines: [], notice: 'Your saved plan could not be read, so it was reset. Sorry about that.' };
  }
  const lines = value.filter(isValidLine);
  const dropped = value.length - lines.length;
  return {
    lines,
    notice:
      dropped > 0
        ? `${dropped} saved ${dropped === 1 ? 'item was' : 'items were'} unreadable and removed from your plan.`
        : null,
  };
}

export function PlanProvider({ children }) {
  // Lazy initial state: localStorage is read only on the first render.
  const [initial] = useState(loadSavedPlan);
  const [lines, setLines] = useState(initial.lines);
  const [storageNotice, setStorageNotice] = useState(initial.notice);
  const [lastBooking, setLastBooking] = useState(() => readJSON(STORAGE_KEYS.lastBooking, null).value);

  // Keep localStorage in sync with the plan (external system synchronisation).
  useEffect(() => {
    writeJSON(STORAGE_KEYS.plan, lines);
  }, [lines]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.lastBooking, lastBooking);
  }, [lastBooking]);

  // Adds a trip, or replaces the existing line for that trip.
  const saveLine = useCallback((newLine) => {
    setLines((prev) => {
      const exists = prev.some((line) => line.experienceId === newLine.experienceId);
      return exists
        ? prev.map((line) => (line.experienceId === newLine.experienceId ? { ...newLine } : line))
        : [...prev, { ...newLine }];
    });
  }, []);

  const updateLine = useCallback((experienceId, patch) => {
    setLines((prev) => prev.map((line) => (line.experienceId === experienceId ? { ...line, ...patch } : line)));
  }, []);

  const toggleAddOn = useCallback((experienceId, addOnId) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.experienceId !== experienceId) return line;
        const addOnIds = line.addOnIds.includes(addOnId)
          ? line.addOnIds.filter((id) => id !== addOnId)
          : [...line.addOnIds, addOnId];
        return { ...line, addOnIds };
      }),
    );
  }, []);

  const removeLine = useCallback((experienceId) => {
    setLines((prev) => prev.filter((line) => line.experienceId !== experienceId));
  }, []);

  // Puts a removed line back at its old position (Undo).
  const restoreLine = useCallback((line, index) => {
    setLines((prev) => {
      if (prev.some((l) => l.experienceId === line.experienceId)) return prev;
      const copy = [...prev];
      copy.splice(Math.min(index, copy.length), 0, line);
      return copy;
    });
  }, []);

  const completeBooking = useCallback((booking) => {
    setLastBooking(booking);
    setLines([]);
  }, []);

  const value = {
    lines,
    storageNotice,
    dismissStorageNotice: () => setStorageNotice(null),
    lastBooking,
    saveLine,
    updateLine,
    toggleAddOn,
    removeLine,
    restoreLine,
    completeBooking,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used inside <PlanProvider>');
  return context;
}
