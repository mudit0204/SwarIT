import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ThemeProvider } from 'next-themes';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ConnectionModal } from '@/components/dashboard/ConnectionModal';
import { KPICards } from '@/components/dashboard/KPICards';
import { DepartmentChart } from '@/components/dashboard/charts/DepartmentChart';
import { IntentChart } from '@/components/dashboard/charts/IntentChart';
import { TimelineChart } from '@/components/dashboard/charts/TimelineChart';
import { SeverityChart } from '@/components/dashboard/charts/SeverityChart';
import { ConfidenceChart } from '@/components/dashboard/charts/ConfidenceChart';
import { FunnelChart } from '@/components/dashboard/charts/FunnelChart';
import { ComplaintTable } from '@/components/dashboard/ComplaintTable';
import { getComplaints, getComplaintStats, isConnected } from '@/services/api';
import type { Complaint, ComplaintFilters, ComplaintStats } from '@/types/complaint';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isConnectedState, setIsConnectedState] = useState(false);
  const [filters, setFilters] = useState<ComplaintFilters>({
    departments: [],
    intents: [],
    severities: [],
    languages: [],
    dateRange: { from: null, to: null },
    search: ''
  });
  
  const { toast } = useToast();

  const availableOptions = {
    departments: Array.from(new Set(complaints.map(c => c.department))),
    intents: Array.from(new Set(complaints.map(c => c.intent))),
    severities: Array.from(new Set(complaints.map(c => c.severity))),
    languages: Array.from(new Set(complaints.map(c => c.language))),
  };

  const loadData = async () => {
    const connected = await isConnected();
    setIsConnectedState(connected);
    if (!connected) {
      setShowConnectionModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const [complaintsData, statsData] = await Promise.all([
        getComplaints(filters),
        getComplaintStats(filters)
      ]);
      setComplaints(complaintsData);
      setStats(statsData);
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
      // If there's an API error, show connection modal
      setShowConnectionModal(true);
      setIsConnectedState(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check connection status on mount and load data
    loadData();
  }, [filters]);

  const handleConnectionSuccess = () => {
    setShowConnectionModal(false);
    setIsConnectedState(true);
    loadData();
  };

  const handleFiltersChange = (newFilters: ComplaintFilters) => {
    setFilters({ ...newFilters, search: filters.search });
  };

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableOptions={availableOptions}
          />
          
          <SidebarInset className="flex-1">
            <DashboardNavbar
              searchValue={filters.search}
              onSearchChange={handleSearchChange}
              onDatabaseClick={() => setShowConnectionModal(true)}
              isConnected={isConnectedState}
            />
            
            <main className="flex-1 p-6 space-y-6">
              {stats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <KPICards stats={stats} isLoading={isLoading} />
                </motion.div>
              )}
              
              <div className="grid gap-6 md:grid-cols-2">
                <DepartmentChart data={stats?.departmentCounts || {}} isLoading={isLoading} />
                <IntentChart data={stats?.intentCounts || {}} isLoading={isLoading} />
                <TimelineChart data={stats?.complaintsOverTime || []} isLoading={isLoading} />
                <SeverityChart data={stats?.severityCounts || {}} isLoading={isLoading} />
                <ConfidenceChart data={stats?.confidenceScoreDistribution || []} isLoading={isLoading} />
                <FunnelChart data={stats?.severityCounts || {}} isLoading={isLoading} />
              </div>
              
              <ComplaintTable data={complaints} isLoading={isLoading} />
            </main>
          </SidebarInset>
        </div>
        
        <ConnectionModal
          open={showConnectionModal}
          onOpenChange={setShowConnectionModal}
          onSuccess={handleConnectionSuccess}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
}