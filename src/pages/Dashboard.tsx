import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Video as VideoIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import VideoUploader from '@/components/VideoUploader';
import { AnimatedTabs } from '@/components/ui/animatedTab';
import { motion, AnimatePresence } from 'framer-motion';
import { mockVideos } from '@/mockData';
import { Video } from '@/types';
import { useSearchStore } from '@/components/Navbar';

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState(mockVideos);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploader, setShowUploader] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchQuery = useSearchStore((state) => state.searchQuery);
  
  const filteredVideos = useMemo(() => {
    let filtered = videos;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
      );
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'ready':
        return filtered.filter(video => video.status === 'ready');
      case 'processing':
        return filtered.filter(video => ['processing', 'uploading'].includes(video.status));
      default:
        return filtered;
    }
  }, [videos, activeTab, searchQuery]);

  const readyVideos = videos.filter((video) => video.status === 'ready');
  const processingVideos = videos.filter((video) => video.status === 'processing');
  const uploadingVideos = videos.filter((video) => video.status === 'uploading');

  const tabs = [
    { id: 'all', label: `All (${videos.length})` },
    { id: 'ready', label: `Ready (${readyVideos.length})` },
    ...(processingVideos.length > 0 || uploadingVideos.length > 0
      ? [{ id: 'processing', label: `In Progress (${processingVideos.length + uploadingVideos.length})` }]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 px-4 md:px-6 py-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
            Videos
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and share your video content
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <Button
            onClick={() => setShowUploader(!showUploader)}
            variant={showUploader ? "outline" : "default"}
            className="gap-2 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            {showUploader ? 'Cancel Upload' : 'Upload New'}
          </Button>
          
          <div className="flex items-center rounded-lg border shadow-sm bg-white/50 backdrop-blur-sm p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <VideoUploader
              onUploadComplete={(newVideo: Video) => {
                setVideos([newVideo, ...videos]);
                setShowUploader(false);
              }}
              onCancel={() => setShowUploader(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-6">
        <AnimatedTabs
          tabs={tabs}
          defaultTab="all"
          onChange={(tabId) => setActiveTab(tabId)}
        />
        
        <div className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start border rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm hover:shadow-md transition-all"
                >
                  <Link to={`/video/${video.id}`} className="block w-48">
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      {video.status === 'ready' && video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <VideoIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="flex-1 p-4">
                    <Link to={`/video/${video.id}`} className="block group">
                      <h3 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
