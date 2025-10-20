import { useState, useEffect } from "react";
import { Employee, Sector } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchSectors();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar funcionários",
        description: "Não foi possível carregar a lista de funcionários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from("sectors")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar setores",
        description: "Não foi possível carregar a lista de setores.",
        variant: "destructive",
      });
    }
  };

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert([employee])
        .select()
        .single();

      if (error) throw error;
      setEmployees((prev) => [...prev, data]);
      toast({
        title: "Funcionário adicionado",
        description: "O funcionário foi adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar funcionário",
        description: "Não foi possível adicionar o funcionário.",
        variant: "destructive",
      });
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      const { error } = await supabase
        .from("employees")
        .update(data)
        .eq("id", id);

      if (error) throw error;
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
      );
      toast({
        title: "Funcionário atualizado",
        description: "O funcionário foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar funcionário",
        description: "Não foi possível atualizar o funcionário.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      toast({
        title: "Funcionário removido",
        description: "O funcionário foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover funcionário",
        description: "Não foi possível remover o funcionário.",
        variant: "destructive",
      });
    }
  };

  const addSector = async (sector: Omit<Sector, "id">) => {
    try {
      const { data, error } = await supabase
        .from("sectors")
        .insert([sector])
        .select()
        .single();

      if (error) throw error;
      setSectors((prev) => [...prev, data]);
      toast({
        title: "Setor adicionado",
        description: "O setor foi adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar setor",
        description: "Não foi possível adicionar o setor.",
        variant: "destructive",
      });
    }
  };

  const deleteSector = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sectors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSectors((prev) => prev.filter((sector) => sector.id !== id));
      toast({
        title: "Setor removido",
        description: "O setor foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover setor",
        description: "Não foi possível remover o setor.",
        variant: "destructive",
      });
    }
  };

  return {
    employees,
    sectors,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addSector,
    deleteSector,
  };
}
