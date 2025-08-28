import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AlertTriangle } from 'lucide-react';

interface SeverityChartProps {
  data: Record<string, number>;
  isLoading?: boolean;
}

const SEVERITY_COLORS = {
  'Low': 'hsl(var(--chart-2))',
  'Medium': 'hsl(var(--chart-3))',
  'High': 'hsl(var(--chart-4))',
  'Critical': 'hsl(var(--destructive))',
};

export function SeverityChart({ data, isLoading }: SeverityChartProps) {
  const severityOrder = ['Low', 'Medium', 'High', 'Critical'];
  const chartData = severityOrder.map(severity => ({
    severity,
    count: data[severity] || 0,
  }));

  const chartConfig = {
    count: {
      label: "Complaints",
    },
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Severity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="shadow-card hover:shadow-glow transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Severity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="severity" 
                  className="text-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  className="transition-all duration-300 hover:brightness-110"
                >
                  {chartData.map((entry, index) => (
                    <Bar 
                      key={entry.severity}
                      fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}