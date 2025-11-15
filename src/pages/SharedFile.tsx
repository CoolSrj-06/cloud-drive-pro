import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileIcon, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

const SharedFile = () => {
  const { username, fileHash } = useParams();
  const [status, setStatus] = useState<'loading' | 'downloading' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    downloadFile();
  }, [username, fileHash]);

  const downloadFile = async () => {
    try {
      setStatus('downloading');
      const response = await api.get(`/files/share/${username}/${fileHash}`, {
        responseType: 'blob',
      });

      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('Error downloading file:', error);
      setStatus('error');
      setError(error.response?.data?.message || 'Failed to download file. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center space-y-4">
            {status === 'loading' && (
              <>
                <FileIcon className="h-16 w-16 text-primary animate-pulse" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Preparing your file</h2>
                  <p className="text-muted-foreground">Please wait...</p>
                </div>
              </>
            )}

            {status === 'downloading' && (
              <>
                <Download className="h-16 w-16 text-primary animate-bounce" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Downloading...</h2>
                  <p className="text-muted-foreground">Your file should start downloading shortly</p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="h-16 w-16 text-destructive" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Download Failed</h2>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedFile;
