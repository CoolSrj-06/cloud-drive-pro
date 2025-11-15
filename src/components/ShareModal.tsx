import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface ShareModalProps {
  fileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareModal = ({ fileId, open, onOpenChange }: ShareModalProps) => {
  const [shareLink, setShareLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && fileId) {
      generateShareLink();
    }
  }, [open, fileId]);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/files/${fileId}/generate-share-link`);
      const fullLink = `${window.location.origin}${response.data.shareLink}`;
      setShareLink(fullLink);
    } catch (error) {
      toast.error('Failed to generate share link');
      console.error('Error generating share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Anyone with this link can download the file
          </p>

          {loading ? (
            <div className="h-10 bg-muted animate-pulse rounded" />
          ) : (
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!shareLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
