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
import { useAbsences } from "@/hooks/useAbsences";
import { useEmployees } from "@/hooks/useEmployees";
import { format, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Printer } from "lucide-react";

export default function Reports() {
  const { absences } = useAbsences();
  const { employees } = useEmployees();
  
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

  const [year, month] = selectedMonth.split("-").map(Number);
  const monthDate = new Date(year, month - 1, 1);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = endOfMonth(monthStart);

  const filteredAbsences = absences.filter((absence) => {
    const [ay, am, ad] = absence.date.split("-").map(Number);
    const absenceDate = new Date(ay, am - 1, ad);
    const isInMonth = absenceDate >= monthStart && absenceDate <= monthEnd;
    const matchesEmployee = selectedEmployee === "all" || absence.employee_id === selectedEmployee;
    return isInMonth && matchesEmployee;
  });

  const handlePrint = () => {
    window.print();
  };

  const justifiedCount = filteredAbsences.filter((a) => a.justified).length;
  const unjustifiedCount = filteredAbsences.filter((a) => !a.justified).length;
  const workingDays = 22; // Aproximado
  const absenceRate = ((filteredAbsences.length / workingDays) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground mt-1">
            Gere e imprima relatórios mensais e gerais
          </p>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="month">Mês de Referência</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee">Funcionário</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Todos os funcionários</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="print:block">
        <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">F C Ribeiro Auto Center Ltda</h1>
            <p className="text-muted-foreground">CNPJ: 25.115.540/0001-41</p>
            <h2 className="text-xl font-semibold mt-4 text-foreground">
              Relatório de Controle de Faltas
            </h2>
            <p className="text-muted-foreground">
              {format(monthDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            {selectedEmployee !== "all" && (
              <p className="text-muted-foreground mt-2">
                Funcionário: {employees.find((e) => e.id === selectedEmployee)?.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{filteredAbsences.length}</p>
              <p className="text-sm text-muted-foreground">Total de Faltas</p>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <p className="text-2xl font-bold text-success">{justifiedCount}</p>
              <p className="text-sm text-muted-foreground">Justificadas</p>
            </div>
            <div className="text-center p-4 bg-destructive/10 rounded-lg">
              <p className="text-2xl font-bold text-destructive">{unjustifiedCount}</p>
              <p className="text-sm text-muted-foreground">Injustificadas</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left text-foreground">Funcionário</th>
                  <th className="border border-border p-2 text-left text-foreground">Setor</th>
                  <th className="border border-border p-2 text-left text-foreground">Data</th>
                  <th className="border border-border p-2 text-left text-foreground">Motivo</th>
                  <th className="border border-border p-2 text-left text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAbsences.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-border p-4 text-center text-muted-foreground">
                      Nenhuma falta registrada no período selecionado
                    </td>
                  </tr>
                ) : (
                  filteredAbsences.map((absence) => (
                    <tr key={absence.id}>
                      <td className="border border-border p-2 text-foreground">{absence.employee_name}</td>
                      <td className="border border-border p-2 text-foreground">{absence.sector}</td>
                      <td className="border border-border p-2 text-foreground">
                        {format(new Date(Number(absence.date.substring(0,4)), Number(absence.date.substring(5,7)) - 1, Number(absence.date.substring(8,10))), "dd/MM/yyyy")}
                      </td>
                      <td className="border border-border p-2 text-foreground">{absence.reason}</td>
                      <td className="border border-border p-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            absence.justified
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {absence.justified ? "Justificada" : "Injustificada"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Relatório gerado em: {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Taxa de absenteísmo no período: {absenceRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
