import { useState, useEffect } from "react";
import { Absence } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAbsences() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      const { data, error } = await supabase
        .from("absences")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setAbsences(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar faltas",
        description: "Não foi possível carregar a lista de faltas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAbsence = async (absence: Omit<Absence, "id">) => {
    try {
      const { data, error } = await supabase
        .from("absences")
        .insert([absence])
        .select()
        .single();

      if (error) throw error;
      setAbsences((prev) => [data, ...prev]);
      toast({
        title: "Falta registrada",
        description: "A falta foi registrada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar falta",
        description: "Não foi possível registrar a falta.",
        variant: "destructive",
      });
    }
  };

  const updateAbsence = async (id: string, data: Partial<Absence>) => {
    try {
      const { error } = await supabase
        .from("absences")
        .update(data)
        .eq("id", id);

      if (error) throw error;
      setAbsences((prev) =>
        prev.map((absence) => (absence.id === id ? { ...absence, ...data } : absence))
      );
      toast({
        title: "Falta atualizada",
        description: "A falta foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar falta",
        description: "Não foi possível atualizar a falta.",
        variant: "destructive",
      });
    }
  };

  const deleteAbsence = async (id: string) => {
    try {
      const { error } = await supabase
        .from("absences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAbsences((prev) => prev.filter((absence) => absence.id !== id));
      toast({
        title: "Falta removida",
        description: "A falta foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover falta",
        description: "Não foi possível remover a falta.",
        variant: "destructive",
      });
    }
  };

  return {
    absences,
    loading,
    addAbsence,
    updateAbsence,
    deleteAbsence,
  };
}
