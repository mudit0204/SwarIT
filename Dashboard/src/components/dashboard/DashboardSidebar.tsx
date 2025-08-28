import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import type { ComplaintFilters } from '@/types/complaint';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface DashboardSidebarProps {
  filters: ComplaintFilters;
  onFiltersChange: (filters: ComplaintFilters) => void;
  availableOptions: {
    departments: string[];
    intents: string[];
    severities: string[];
    languages: string[];
  };
}

export function DashboardSidebar({ filters, onFiltersChange, availableOptions }: DashboardSidebarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters.dateRange.from || undefined,
    to: filters.dateRange.to || undefined,
  });

  const handleCheckboxChange = (category: keyof Omit<ComplaintFilters, 'dateRange' | 'search'>, value: string, checked: boolean) => {
    const currentValues = filters[category] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFiltersChange({
      ...filters,
      [category]: newValues
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFiltersChange({
      ...filters,
      dateRange: {
        from: range?.from || null,
        to: range?.to || null
      }
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      departments: [],
      intents: [],
      severities: [],
      languages: [],
      dateRange: { from: null, to: null },
      search: ''
    });
    setDateRange(undefined);
  };

  const getActiveFiltersCount = () => {
    return filters.departments.length + 
           filters.intents.length + 
           filters.severities.length + 
           filters.languages.length +
           (filters.dateRange.from || filters.dateRange.to ? 1 : 0);
  };

  const FilterGroup = ({ title, options, category }: { 
    title: string; 
    options: string[]; 
    category: keyof Omit<ComplaintFilters, 'dateRange' | 'search'> 
  }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium">{title}</SidebarGroupLabel>
      <SidebarGroupContent className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${option}`}
              checked={filters[category].includes(option)}
              onCheckedChange={(checked) => 
                handleCheckboxChange(category, option, checked as boolean)
              }
            />
            <Label 
              htmlFor={`${category}-${option}`}
              className="text-sm font-normal cursor-pointer flex-1"
            >
              {option}
            </Label>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Date Range Filter */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium">Date Range</SidebarGroupLabel>
            <SidebarGroupContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <FilterGroup
            title="Department"
            options={availableOptions.departments}
            category="departments"
          />

          <Separator />

          <FilterGroup
            title="Intent"
            options={availableOptions.intents}
            category="intents"
          />

          <Separator />

          <FilterGroup
            title="Severity"
            options={availableOptions.severities}
            category="severities"
          />

          <Separator />

          <FilterGroup
            title="Language"
            options={availableOptions.languages}
            category="languages"
          />
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}