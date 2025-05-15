
import React from 'react';
import { ShareLink } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { Link, Users, Clock, Trash, Eye, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface ShareLinkTableProps {
  links: ShareLink[];
  onDelete: (id: string) => void;
}

const ShareLinkTable: React.FC<ShareLinkTableProps> = ({ links, onDelete }) => {
  const { toast } = useToast();

  const getExpiryString = (link: ShareLink) => {
    if (link.expiry === 'forever') return 'Never expires';
    if (link.isExpired) return 'Expired';
    if (link.expiresAt) {
      return `Expires ${formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}`;
    }
    return '';
  };

  const handleCopyLink = (slug: string) => {
    const linkUrl = `${window.location.origin}/shared/${slug}`;
    navigator.clipboard.writeText(linkUrl);
    toast({
      title: 'Link copied',
      description: 'The share link has been copied to your clipboard',
    });
  };

  const renderLinkStatus = (link: ShareLink) => {
    if (link.isExpired) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          Expired
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          Active
        </Badge>
      );
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left px-4 py-2 text-sm font-medium">Link ID</th>
              <th className="text-left px-4 py-2 text-sm font-medium">Created</th>
              <th className="text-left px-4 py-2 text-sm font-medium">Type</th>
              <th className="text-left px-4 py-2 text-sm font-medium">Status</th>
              <th className="text-left px-4 py-2 text-sm font-medium">Expiry</th>
              <th className="text-left px-4 py-2 text-sm font-medium">Last Viewed</th>
              <th className="px-4 py-2 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No share links have been created yet
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id} className="border-t">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{link.slug.slice(0, 12)}...</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {format(new Date(link.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            {link.visibility === 'public' ? (
                              <Badge variant="outline" className="gap-1 text-blue-600 bg-blue-50 border-blue-200">
                                <Link className="h-3 w-3" />
                                <span>Public</span>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-violet-600 bg-violet-50 border-violet-200">
                                <Users className="h-3 w-3" />
                                <span>Private</span>
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        {link.visibility === 'private' && link.whitelistedEmails && (
                          <TooltipContent>
                            <p className="font-medium mb-1">Authorized Emails:</p>
                            <ul className="text-xs list-disc pl-4">
                              {link.whitelistedEmails.map((email) => (
                                <li key={email}>{email}</li>
                              ))}
                            </ul>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {renderLinkStatus(link)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{getExpiryString(link)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {link.lastViewedAt ? (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>
                            {formatDistanceToNow(new Date(link.lastViewedAt), { addSuffix: true })}
                          </span>
                        </>
                      ) : (
                        <span>Not viewed yet</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyLink(link.slug)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => onDelete(link.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShareLinkTable;
