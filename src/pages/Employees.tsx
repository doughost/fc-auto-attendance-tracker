import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Employees() {
  const { employees, sectors, addEmployee, updateEmployee, deleteEmployee, addSector } = useEmployees();
  
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [position, setPosition] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [newSectorName, setNewSectorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !sector || !position) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (editingId) {
      updateEmployee(editingId, { name, sector, position });
      toast.success("Funcionário atualizado com sucesso!");
      setEditingId(null);
    } else {
      addEmployee({ name, sector, position });
      toast.success("Funcionário adicionado com sucesso!");
    }

    setName("");
    setSector("");
    setPosition("");
  };

  const handleEdit = (id: string) => {
    const employee = employees.find((e) => e.id === id);
    if (!employee) return;

    setEditingId(id);
    setName(employee.name);
    setSector(employee.sector);
    setPosition(employee.position);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteEmployee(deleteId);
      toast.success("Funcionário excluído com sucesso!");
      setDeleteId(null);
    }
  };

  const handleAddSector = () => {
    if (!newSectorName) {
      toast.error("Digite o nome do setor");
      return;
    }

    addSector({ name: newSectorName });
    toast.success("Setor adicionado com sucesso!");
    setNewSectorName("");
    setShowSectorDialog(false);
  };

  const groupedEmployees = employees.reduce((acc, emp) => {
    if (!acc[emp.sector]) {
      acc[emp.sector] = [];
    }
    acc[emp.sector].push(emp);
    return acc;
  }, {} as Record<string, typeof employees>);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gestão de Funcionários</h2>
        <p className="text-muted-foreground mt-1">
          Adicione, edite ou remova funcionários e setores
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Funcionário" : "Novo Funcionário"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome do funcionário"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Setor *</Label>
                <div className="flex gap-2">
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {sectors.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSectorDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Ex: Mecânico, Atendente..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Atualizar" : "Adicionar"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                      setSector("");
                      setPosition("");
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
            <CardTitle>Funcionários Cadastrados ({employees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {Object.entries(groupedEmployees).map(([sectorName, sectorEmployees]) => (
                <div key={sectorName}>
                  <h3 className="font-semibold text-lg mb-3 text-primary">{sectorName}</h3>
                  <div className="space-y-2">
                    {sectorEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between border border-border rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(employee.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteId(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Setor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-sector">Nome do Setor</Label>
              <Input
                id="new-sector"
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                placeholder="Digite o nome do setor"
              />
            </div>
            <Button onClick={handleAddSector} className="w-full">
              Adicionar Setor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
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
