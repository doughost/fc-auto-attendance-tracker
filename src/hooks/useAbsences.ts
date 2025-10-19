import { useState, useEffect } from "react";
import { Absence } from "@/types";

const STORAGE_KEY = "absences";

export function useAbsences() {
  const [absences, setAbsences] = useState<Absence[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(absences));
  }, [absences]);

  const addAbsence = (absence: Omit<Absence, "id">) => {
    const newAbsence = {
      ...absence,
      id: Date.now().toString(),
    };
    setAbsences((prev) => [...prev, newAbsence]);
  };

  const updateAbsence = (id: string, data: Partial<Absence>) => {
    setAbsences((prev) =>
      prev.map((absence) => (absence.id === id ? { ...absence, ...data } : absence))
    );
  };

  const deleteAbsence = (id: string) => {
    setAbsences((prev) => prev.filter((absence) => absence.id !== id));
  };

  return {
    absences,
    addAbsence,
    updateAbsence,
    deleteAbsence,
  };
}
