import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAbsences } from "@/hooks/useAbsences";
import { useEmployees } from "@/hooks/useEmployees";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Statistics() {
  const { absences } = useAbsences();
  const { employees, sectors } = useEmployees();

  const absencesBySector = sectors.map((sector) => ({
    name: sector.name,
    total: absences.filter((a) => a.sector === sector.name).length,
    justificadas: absences.filter((a) => a.sector === sector.name && a.justified).length,
    injustificadas: absences.filter((a) => a.sector === sector.name && !a.justified).length,
  }));

  const totalJustified = absences.filter((a) => a.justified).length;
  const totalUnjustified = absences.filter((a) => !a.justified).length;

  const pieData = [
    { name: "Justificadas", value: totalJustified },
    { name: "Injustificadas", value: totalUnjustified },
  ];

  const COLORS = ["hsl(var(--success))", "hsl(var(--destructive))"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Estatísticas</h2>
        <p className="text-muted-foreground mt-1">
          Visualize dados e tendências de faltas
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Faltas por Setor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={absencesBySector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))" 
                  }} 
                />
                <Legend />
                <Bar dataKey="justificadas" fill="hsl(var(--success))" name="Justificadas" />
                <Bar dataKey="injustificadas" fill="hsl(var(--destructive))" name="Injustificadas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))" 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Detalhado por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {absencesBySector.map((sector) => {
              const employeesInSector = employees.filter((e) => e.sector === sector.name).length;
              const avgAbsences = employeesInSector > 0 ? (sector.total / employeesInSector).toFixed(1) : "0";
              
              return (
                <div key={sector.name} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{sector.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {employeesInSector} funcionários
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{sector.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{sector.justificadas}</p>
                      <p className="text-xs text-muted-foreground">Justificadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-destructive">{sector.injustificadas}</p>
                      <p className="text-xs text-muted-foreground">Injustificadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{avgAbsences}</p>
                      <p className="text-xs text-muted-foreground">Média/Func.</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
