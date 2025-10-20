import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserX, TrendingUp, Calendar } from "lucide-react";
import { useAbsences } from "@/hooks/useAbsences";
import { useEmployees } from "@/hooks/useEmployees";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { absences } = useAbsences();
  const { employees } = useEmployees();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthAbsences = absences.filter(
    (absence) => new Date(absence.date) >= monthStart && new Date(absence.date) <= monthEnd
  );

  const justifiedAbsences = monthAbsences.filter((a) => a.justified).length;
  const unjustifiedAbsences = monthAbsences.filter((a) => !a.justified).length;

  const stats = [
    {
      name: "Total de Funcionários",
      value: employees.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Faltas no Mês",
      value: monthAbsences.length,
      icon: UserX,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      name: "Faltas Justificadas",
      value: justifiedAbsences,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Faltas Injustificadas",
      value: unjustifiedAbsences,
      icon: Calendar,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Sistema de gerenciamento e acompanhamento de faltas dos colaboradores
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faltas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {monthAbsences.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma falta registrada neste mês
            </p>
          ) : (
            <div className="space-y-4">
              {monthAbsences.slice(0, 5).map((absence) => (
                <div
                  key={absence.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{absence.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {absence.sector} - {format(new Date(absence.date), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      absence.justified
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {absence.justified ? "Justificada" : "Injustificada"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
