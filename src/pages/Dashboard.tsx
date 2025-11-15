import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StorageInfo from '@/components/StorageInfo';
import FileList from '@/components/FileList';
import UploadModal from '@/components/UploadModal';

const Dashboard = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Files</h1>
            <p className="text-muted-foreground">Manage your files and storage</p>
          </div>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <StorageInfo key={refreshKey} />
          </div>
          
          <div className="lg:col-span-3">
            <FileList key={refreshKey} onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
