import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import type { ComplaintStats } from '@/types/complaint';

interface KPICardsProps {
  stats: ComplaintStats;
  isLoading?: boolean;
}

export function KPICards({ stats, isLoading }: KPICardsProps) {
  const kpis = [
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: FileText,
      trend: '+12%',
      trendDirection: 'up' as const,
      color: 'text-primary'
    },
    {
      title: 'Today\'s Complaints',
      value: stats.complaintsToday,
      icon: Calendar,
      trend: '+5%',
      trendDirection: 'up' as const,
      color: 'text-success'
    },
    {
      title: 'High Severity',
      value: (stats.severityCounts['High'] || 0) + (stats.severityCounts['Critical'] || 0),
      icon: AlertTriangle,
      trend: '-8%',
      trendDirection: 'down' as const,
      color: 'text-destructive'
    },
    {
      title: 'Missing Fields',
      value: stats.complaintsWithMissingFields,
      percentage: Math.round((stats.complaintsWithMissingFields / stats.totalComplaints) * 100),
      icon: AlertCircle,
      trend: '-3%',
      trendDirection: 'down' as const,
      color: 'text-warning'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.value.toLocaleString()}
                {kpi.percentage && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({kpi.percentage}%)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant={kpi.trendDirection === 'up' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {kpi.trendDirection === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {kpi.trend}
                </Badge>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
            
            {/* Gradient overlay */}
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-primary"></div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}