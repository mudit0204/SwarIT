import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, AlertCircle } from 'lucide-react';
import { connectToMongoDB } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ConnectionModal({ open, onOpenChange, onSuccess }: ConnectionModalProps) {
  const [formData, setFormData] = useState({
    uri: 'mongodb+srv://prakharpatni321:StrongPassword123@municipalcluster.tt4pe9t.mongodb.net/?retryWrites=true&w=majority&appName=MunicipalCluster',
    database: 'municipal_ai',
    collection: 'complaints'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await connectToMongoDB();
      toast({
        title: "Connected successfully!",
        description: "Your backend API connection is now active.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend API');
      toast({
        title: "Connection failed",
        description: err.message || 'Failed to connect to backend API',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Connect to MongoDB
          </DialogTitle>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your MongoDB credentials will be stored locally in your browser only for this session.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="uri">MongoDB URI</Label>
            <Input
              id="uri"
              type="text"
              value={formData.uri}
              onChange={(e) => setFormData(prev => ({ ...prev, uri: e.target.value }))}
              placeholder="mongodb+srv://..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                type="text"
                value={formData.database}
                onChange={(e) => setFormData(prev => ({ ...prev, database: e.target.value }))}
                placeholder="municipal_ai"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection">Collection Name</Label>
              <Input
                id="collection"
                type="text"
                value={formData.collection}
                onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                placeholder="complaints"
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}