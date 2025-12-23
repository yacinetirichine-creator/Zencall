"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CallsChartProps {
  data: { date: string; count: number }[];
}

export function CallsChart({ data }: CallsChartProps) {
  const chartData = data.map((d) => ({
    name: new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    appels: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appels des 7 derniers jours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="appels" fill="#FFBCBC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
