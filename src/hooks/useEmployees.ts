import { useState, useEffect } from "react";
import { Employee, Sector } from "@/types";
import { initialEmployees, initialSectors } from "@/data/initialData";

const EMPLOYEES_KEY = "employees";
const SECTORS_KEY = "sectors";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const stored = localStorage.getItem(EMPLOYEES_KEY);
    return stored ? JSON.parse(stored) : initialEmployees;
  });

  const [sectors, setSectors] = useState<Sector[]>(() => {
    const stored = localStorage.getItem(SECTORS_KEY);
    return stored ? JSON.parse(stored) : initialSectors;
  });

  useEffect(() => {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(SECTORS_KEY, JSON.stringify(sectors));
  }, [sectors]);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const addSector = (sector: Omit<Sector, "id">) => {
    const newSector = {
      ...sector,
      id: Date.now().toString(),
    };
    setSectors((prev) => [...prev, newSector]);
  };

  const deleteSector = (id: string) => {
    setSectors((prev) => prev.filter((sector) => sector.id !== id));
  };

  return {
    employees,
    sectors,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addSector,
    deleteSector,
  };
}
