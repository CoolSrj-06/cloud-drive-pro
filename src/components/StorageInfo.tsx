import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface UsageData {
  usedStorage: number;
  totalStorage: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const StorageInfo = () => {
  const [usage, setUsage] = useState<UsageData>({ usedStorage: 0, totalStorage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await api.get('/user/myUsage');
      setUsage(response.data);
    } catch (error) {
      toast.error('Failed to load storage info');
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const percentage = usage.totalStorage > 0 
    ? Math.round((usage.usedStorage / usage.totalStorage) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HardDrive className="h-5 w-5 text-primary" />
          Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-2 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-32" />
          </div>
        ) : (
          <>
            <Progress value={percentage} className="h-2" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {formatBytes(usage.usedStorage)} / {formatBytes(usage.totalStorage)}
              </p>
              <p className="text-xs text-muted-foreground">
                {percentage}% used
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StorageInfo;
