import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Video, Clock, Check, Loader, Download, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Video as VideoType } from '@/types';
import { motion } from 'framer-motion';

interface VideoCardProps {
  video: VideoType;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && video.status === 'ready') {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getStatusBadge = () => {
    switch (video.status) {
      case 'uploading':
        return (
          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 animate-pulse">
            <Loader className="h-3 w-3 animate-spin" />
            <span>Uploading</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700">
            <Loader className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </Badge>
        );
      case 'ready':
        return (
          <Badge variant="outline" className="gap-1 bg-green-50 text-green-700">
            <Check className="h-3 w-3" />
            <span>Ready</span>
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="gap-1 bg-red-50 text-red-700">
            <span>Error</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        <Link to={`/video/${video.id}`} className="block">
          <div 
            className="relative aspect-video w-full overflow-hidden bg-gray-100"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {video.status === 'ready' ? (
              <>
                {video.url ? (
                  <video
                    ref={videoRef}
                    src={video.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    loop
                    poster={video.thumbnailUrl}
                  />
                ) : (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                )}
                {isHovering && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {video.status === 'uploading' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <p className="text-sm mb-2 font-medium">Uploading... {video.progress}%</p>
                <Progress value={video.progress} className="w-3/4 h-1" />
              </div>
            )}
            
            {video.status === 'processing' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                  <Loader className="h-8 w-8 animate-spin mb-2" />
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 overflow-hidden">
              <Link to={`/video/${video.id}`} className="block group">
                <h3 className="text-base font-medium truncate mb-1 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </span>
                {video.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <span>•</span>
                    {formatDuration(video.duration)}
                  </span>
                )}
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardContent>
        
        {video.status === 'ready' && (
          <CardFooter className="px-4 py-2 bg-gray-50/80 backdrop-blur-sm flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs gap-1 hover:bg-white/80 transition-colors"
              asChild
            >
              <a href={video.url} download={video.title}>
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default VideoCard;
