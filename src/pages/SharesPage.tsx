import React, { useState } from 'react';
import { ArrowLeft, Filter, Clock, Link as LinkIcon, Plus, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockShareLinks } from '@/mockData';
import { getVideoById } from '@/mockData';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SharesPage: React.FC = () => {
  const [shareLinks, setShareLinks] = useState(mockShareLinks);
  const navigate = useNavigate();

  const handleDeleteShareLink = (linkId: string) => {
    setShareLinks(shareLinks.filter(link => link.id !== linkId));
  };

  const getExpiryString = (link: any) => {
    if (link.expiry === 'forever') return 'Never expires';
    if (link.isExpired) return 'Expired';
    if (link.expiresAt) {
      return `Expires ${formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}`;
    }
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 px-4 md:px-6 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
            Share Links
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your video share links
          </p>
        </div>
        
      </motion.div>
      
      
      <AnimatePresence>
        <div className="space-y-4">
          {shareLinks.length > 0 ? (
            shareLinks.map((link, index) => {
              const video = getVideoById(link.videoId);
              if (!video) return null;
              
              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden border hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div
                        className="w-full md:w-48 h-32 md:h-auto cursor-pointer overflow-hidden"
                        onClick={() => navigate(`/video/${video.id}`)}
                      >
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <LinkIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className="font-medium hover:text-blue-600 transition-colors cursor-pointer"
                                onClick={() => navigate(`/video/${video.id}`)}
                              >
                                {video.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`${
                                  link.isExpired
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : 'bg-green-50 text-green-600 border-green-200'
                                }`}
                              >
                                {link.isExpired ? 'Expired' : 'Active'}
                              </Badge>
                              
                              {link.visibility === 'public' ? (
                                <Badge variant="outline" className="gap-1 text-blue-600 bg-blue-50 border-blue-200">
                                  <LinkIcon className="h-3 w-3" />
                                  <span>Public</span>
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-violet-600 bg-violet-50 border-violet-200">
                                  <span>Private</span>
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Created {format(new Date(link.createdAt), 'PP')}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{getExpiryString(link)}</span>
                              </div>
                              
                              {link.lastViewedAt && (
                                <div className="flex items-center gap-1.5">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>
                                    Last viewed {formatDistanceToNow(new Date(link.lastViewedAt), { addSuffix: true })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-start md:self-center">
                            {!link.isExpired && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 shadow-sm hover:bg-blue-50"
                                onClick={() => {}}
                              >
                                <LinkIcon className="h-3.5 w-3.5" />
                                Copy Link
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-red-50 gap-2"
                              onClick={() => handleDeleteShareLink(link.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="py-10 text-center"
            >
              <h3 className="text-lg font-medium mb-2">No share links found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any share links yet. Create one by going to a video and clicking Share.
              </p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SharesPage;
