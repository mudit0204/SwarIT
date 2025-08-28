import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FunnelChartProps {
  data: Record<string, number>;
  isLoading?: boolean;
}

export function FunnelChart({ data, isLoading }: FunnelChartProps) {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Complaint Status Funnel
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert data to funnel format (assuming severity levels represent a funnel)
  const funnelData = [
    { label: 'Total Complaints', value: Object.values(data).reduce((sum, val) => sum + val, 0), percentage: 100 },
    { label: 'High', value: data['High'] || 0, percentage: 0 },
    { label: 'Medium', value: data['Medium'] || 0, percentage: 0 },
    { label: 'Low', value: data['Low'] || 0, percentage: 0 },
  ];

  // Calculate percentages based on total
  const total = funnelData[0].value;
  funnelData.forEach((item, index) => {
    if (index > 0 && total > 0) {
      item.percentage = (item.value / total) * 100;
    }
  });

  const getColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
    ];
    return colors[index] || 'bg-gray-500';
  };

  const getWidth = (percentage: number) => {
    return Math.max(percentage, 10); // Minimum width for visibility
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Complaint Severity Funnel
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {funnelData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.value} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-8 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getWidth(item.percentage)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full ${getColor(index)} rounded-full flex items-center justify-center`}
                  >
                    {item.value > 0 && (
                      <span className="text-white text-xs font-medium">
                        {item.value}
                      </span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {total > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              {/* <div className="text-xs text-muted-foreground">
                Funnel Conversion Rate
              </div> */}
              <div className="text-sm font-medium">
                Critical: {((funnelData[1].value / total) * 100).toFixed(1)}% of total complaints
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
