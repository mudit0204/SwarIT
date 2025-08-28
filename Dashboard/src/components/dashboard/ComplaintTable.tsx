import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  Download,
  TableIcon
} from 'lucide-react';
import type { Complaint } from '@/types/complaint';
import { format, parseISO } from 'date-fns';
import Papa from 'papaparse';

interface ComplaintTableProps {
  data: Complaint[];
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<Complaint>();

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'destructive';
    case 'High': return 'destructive';
    case 'Medium': return 'warning';
    case 'Low': return 'secondary';
    default: return 'secondary';
  }
};

export function ComplaintTable({ data, isLoading }: ComplaintTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const columns = useMemo(() => [
    columnHelper.accessor('summary', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Summary
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate" title={getValue()}>
          {getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('department', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    }),
    columnHelper.accessor('severity', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Severity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <Badge variant={getSeverityColor(getValue()) as any}>
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
    }),
    columnHelper.accessor('date', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        try {
          const dateValue = getValue();
          const parsedDate = dateValue.includes('T') ? parseISO(dateValue) : parseISO(dateValue + 'T00:00:00');
          return format(parsedDate, 'MMM dd, yyyy');
        } catch (error) {
          console.warn('Invalid date format:', getValue());
          return getValue(); // Return original value as fallback
        }
      },
    }),
    columnHelper.accessor('confidence_score', {
      header: 'Confidence',
      cell: ({ getValue }) => {
        const score = getValue();
        const isLow = score < 0.5;
        return (
          <Badge variant={isLow ? 'destructive' : 'secondary'}>
            {(score * 100).toFixed(1)}%
          </Badge>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const exportToCSV = () => {
    const csvData = data.map(complaint => ({
      ID: complaint._id,
      Summary: complaint.summary,
      Department: complaint.department,
      Severity: complaint.severity,
      Location: complaint.location,
      Date: complaint.date,
      Language: complaint.language,
      'Confidence Score': complaint.confidence_score,
      'Missing Fields': complaint.missing_fields.join(', '),
      'Final Summary': complaint.final_summary,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `complaints_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-primary" />
            Complaints Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TableIcon className="h-5 w-5 text-primary" />
              Complaints Table
            </CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedComplaint(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Detail Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>ID:</strong> {selectedComplaint._id}</div>
                    <div><strong>Name:</strong> {selectedComplaint.name}</div>
                    <div><strong>Department:</strong> {selectedComplaint.department}</div>
                    <div><strong>Intent:</strong> {selectedComplaint.intent}</div>
                    <div><strong>Location:</strong> {selectedComplaint.location}</div>
                    <div><strong>Date:</strong> {format(parseISO(selectedComplaint.date), 'MMMM dd, yyyy')}</div>
                    <div><strong>Language:</strong> {selectedComplaint.language}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Status Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <strong>Severity:</strong>
                      <Badge variant={getSeverityColor(selectedComplaint.severity) as any}>
                        {selectedComplaint.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Confidence Score:</strong>
                      <Badge variant={selectedComplaint.confidence_score < 0.5 ? 'destructive' : 'secondary'}>
                        {(selectedComplaint.confidence_score * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div>
                      <strong>Missing Fields:</strong> 
                      {selectedComplaint.missing_fields.length > 0 
                        ? selectedComplaint.missing_fields.join(', ')
                        : 'None'
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{selectedComplaint.summary}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Final Summary</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{selectedComplaint.final_summary}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Raw Transcript</h4>
                <div className="text-sm bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                  {selectedComplaint.raw_transcript}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}