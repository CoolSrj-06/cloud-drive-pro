import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Trash2, Globe, Lock, Share2, FileIcon } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import ShareModal from './ShareModal';

interface File {
  id: string;
  filename: string;
  uploadedAt: string;
  isPublic: boolean;
  size?: number;
}

interface FileListProps {
  onUploadSuccess?: () => void;
}

const FileList = ({ onUploadSuccess }: FileListProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [onUploadSuccess]);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/user/files');
      setFiles(response.data);
    } catch (error) {
      toast.error('Failed to load files');
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await api.delete(`/files/${fileId}`);
      toast.success('File deleted successfully');
      fetchFiles();
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Error deleting file:', error);
    }
  };

  const handleTogglePublic = async (fileId: string, currentStatus: boolean) => {
    try {
      await api.put(`/files/${fileId}`, { isPublic: !currentStatus });
      toast.success(`File is now ${!currentStatus ? 'public' : 'private'}`);
      fetchFiles();
    } catch (error) {
      toast.error('Failed to update file visibility');
      console.error('Error toggling public status:', error);
    }
  };

  const handleShare = (fileId: string) => {
    setSelectedFileId(fileId);
    setShareModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5 text-primary" />
            My Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.filename}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(file.uploadedAt)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 text-sm ${
                          file.isPublic ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {file.isPublic ? (
                            <>
                              <Globe className="h-4 w-4" /> Public
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" /> Private
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(file.id, file.filename)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublic(file.id, file.isPublic)}
                          >
                            {file.isPublic ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(file.id)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(file.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFileId && (
        <ShareModal
          fileId={selectedFileId}
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
        />
      )}
    </>
  );
};

export default FileList;
