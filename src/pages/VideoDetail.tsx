import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Share, Download, ArrowLeft, Plus, Trash, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ShareLinkForm from '@/components/ShareLinkForm';
import ShareLinkTable from '@/components/ShareLinkTable';
import { useToast } from '@/hooks/use-toast';
import { getVideoById, getShareLinksForVideo, mockShareLinks } from '@/mockData';
import { Video, ShareLink, ShareVisibility, ShareExpiry } from '@/types';
import  VideoPlayer  from '@/components/ui/VideoPlayer';
const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [video, setVideo] = useState<Video | undefined>(
    id ? getVideoById(id) : undefined
  );
  const [shareLinks, setShareLinks] = useState<ShareLink[]>(
    id ? getShareLinksForVideo(id) : []
  );
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">Video not found</h2>
        <p className="text-muted-foreground mb-6">
          The video you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  const handleCreateShareLink = (data: {
    visibility: ShareVisibility;
    expiry: ShareExpiry;
    whitelistedEmails: string[] | null;
  }) => {
    // Calculate expiry date based on selected option
    let expiresAt: string | null = null;
    
    if (data.expiry !== 'forever') {
      const now = new Date();
      switch (data.expiry) {
        case '1h':
          now.setHours(now.getHours() + 1);
          break;
        case '12h':
          now.setHours(now.getHours() + 12);
          break;
        case '1d':
          now.setDate(now.getDate() + 1);
          break;
        case '7d':
          now.setDate(now.getDate() + 7);
          break;
        case '30d':
          now.setDate(now.getDate() + 30);
          break;
      }
      expiresAt = now.toISOString();
    }

    // Create a new share link
    const newShareLink: ShareLink = {
      id: `share-${Date.now()}`,
      videoId: video.id,
      slug: `${video.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`,
      visibility: data.visibility,
      expiry: data.expiry,
      expiresAt: expiresAt,
      createdAt: new Date().toISOString(),
      lastViewedAt: null,
      whitelistedEmails: data.whitelistedEmails,
      isExpired: false,
    };

    setShareLinks([newShareLink, ...shareLinks]);

    // Show success toast
    toast({
      title: 'Share link created',
      description: 'Your video share link has been successfully created',
    });

    // If this is a private link with whitelisted emails, simulate sending notifications
    if (data.visibility === 'private' && data.whitelistedEmails && data.whitelistedEmails.length > 0) {
      toast({
        title: 'Notifications sent',
        description: `Notification emails have been sent to ${data.whitelistedEmails.length} recipient(s)`,
      });
    }
  };

  const handleDeleteShareLink = (linkId: string) => {
    setShareLinks(shareLinks.filter(link => link.id !== linkId));
    
    toast({
      title: 'Share link deleted',
      description: 'The share link has been successfully removed',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          
          <Button className="gap-2" onClick={() => setIsShareDialogOpen(true)}>
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden bg-black aspect-video shadow-lg">
            {video.status === 'ready' ? (
              video.thumbnailUrl ? (
                <VideoPlayer 
                  src={video.url} 
                  poster={video.thumbnailUrl}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full video-placeholder" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Video is still processing...</p>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Badge variant={video.status === 'ready' ? 'outline' : 'secondary'}>
                {video.status === 'ready' ? 'Ready' : 'Processing'}
              </Badge>
              <span>•</span>
              <span>Uploaded {format(new Date(video.createdAt), 'PPP')}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Share Links</h2>
            {shareLinks.length === 0 ? (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <p className="text-muted-foreground mb-4 text-center">
                    No share links created yet. Create your first share link to allow others to access this video.
                  </p>
                  <Button onClick={() => setIsShareDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Share Link
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ShareLinkTable
                links={shareLinks}
                onDelete={handleDeleteShareLink}
              />
            )}
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-lg font-semibold">Video Details</h3>
              
              <Separator className="my-2" />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Filename</span>
                  <span className="font-medium truncate max-w-[180px]">{video.filename}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{formatFileSize(video.fileSize)}</span>
                </div>
                
                {video.status === 'ready' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{formatDuration(video.duration)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{format(new Date(video.createdAt), 'PPp')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span className="font-medium">{format(new Date(video.updatedAt), 'PPp')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Share Links</span>
                  <span className="font-medium">{shareLinks.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ShareLinkForm
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onCreateShareLink={handleCreateShareLink}
      />
    </div>
  );
};

export default VideoDetail;
