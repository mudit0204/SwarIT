import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TimelineChartProps {
  data: { date: string; count: number }[];
  isLoading?: boolean;
}

export function TimelineChart({ data, isLoading }: TimelineChartProps) {
  const chartData = data
    .map(item => {
      try {
        // Try to parse the date, fallback to current date if invalid
        const parsedDate = item.date.includes('T') ? parseISO(item.date) : parseISO(item.date + 'T00:00:00');
        return {
          ...item,
          formattedDate: format(parsedDate, 'MMM dd'),
        };
      } catch (error) {
        console.warn('Invalid date format:', item.date);
        return {
          ...item,
          formattedDate: item.date, // Use original date string as fallback
        };
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const chartConfig = {
    count: {
      label: "Complaints",
      color: "hsl(var(--chart-1))",
    },
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Complaints Over Time
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
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="shadow-card hover:shadow-glow transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Complaints Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="formattedDate" 
                  className="text-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--chart-1))', strokeWidth: 2 }}
                  className="transition-all duration-300"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}