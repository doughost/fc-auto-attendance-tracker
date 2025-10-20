import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAbsences } from "@/hooks/useAbsences";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Absences() {
  const { absences, addAbsence, updateAbsence, deleteAbsence } = useAbsences();
  const { employees } = useEmployees();
  
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [justified, setJustified] = useState("true");
  const [observations, setObservations] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !date || !reason) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const employee = employees.find((emp) => emp.id === selectedEmployee);
    if (!employee) return;

    const absenceData = {
      employee_id: employee.id,
      employee_name: employee.name,
      sector: employee.sector,
      position: employee.position,
      date,
      reason,
      justified: justified === "true",
      observations,
    };

    if (editingId) {
      updateAbsence(editingId, absenceData);
      toast.success("Falta atualizada com sucesso!");
      setEditingId(null);
    } else {
      addAbsence(absenceData);
      toast.success("Falta registrada com sucesso!");
    }

    // Reset form
    setSelectedEmployee("");
    setDate("");
    setReason("");
    setJustified("true");
    setObservations("");
  };

  const handleEdit = (id: string) => {
    const absence = absences.find((a) => a.id === id);
    if (!absence) return;

    setEditingId(id);
    setSelectedEmployee(absence.employee_id);
    setDate(absence.date);
    setReason(absence.reason);
    setJustified(absence.justified ? "true" : "false");
    setObservations(absence.observations || "");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAbsence(deleteId);
      toast.success("Falta excluída com sucesso!");
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          {editingId ? "Editar Falta" : "Registrar Falta"}
        </h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados abaixo para registrar uma nova falta
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Registro" : "Nova Falta"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Funcionário *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} - {emp.sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data da Falta *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Doença, Emergência familiar..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="justified">Status *</Label>
                <Select value={justified} onValueChange={setJustified}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="true">Justificada</SelectItem>
                    <SelectItem value="false">Injustificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Informações adicionais..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Atualizar" : "Registrar"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setSelectedEmployee("");
                      setDate("");
                      setReason("");
                      setJustified("true");
                      setObservations("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faltas Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {absences.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma falta registrada
                </p>
              ) : (
                absences.map((absence) => (
                  <div
                    key={absence.id}
                    className="border border-border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {absence.employee_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {absence.sector} - {absence.position}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Data: {format(new Date(Number(absence.date.substring(0,4)), Number(absence.date.substring(5,7)) - 1, Number(absence.date.substring(8,10))), "dd/MM/yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Motivo: {absence.reason}
                        </p>
                        {absence.observations && (
                          <p className="text-sm text-muted-foreground">
                            Obs: {absence.observations}
                          </p>
                        )}
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-2 ${
                            absence.justified
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {absence.justified ? "Justificada" : "Injustificada"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(absence.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(absence.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta falta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
