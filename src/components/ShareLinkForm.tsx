
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { ShareExpiry, ShareVisibility } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ShareLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShareLink: (data: {
    visibility: ShareVisibility;
    expiry: ShareExpiry;
    whitelistedEmails: string[] | null;
  }) => void;
}

const ShareLinkForm: React.FC<ShareLinkFormProps> = ({ isOpen, onClose, onCreateShareLink }) => {
  const [visibility, setVisibility] = useState<ShareVisibility>('public');
  const [expiry, setExpiry] = useState<ShareExpiry>('7d');
  const [emailInput, setEmailInput] = useState('');
  const [whitelistedEmails, setWhitelistedEmails] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddEmail = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (!whitelistedEmails.includes(emailInput)) {
      setWhitelistedEmails([...whitelistedEmails, emailInput]);
      setEmailInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (email: string) => {
    setWhitelistedEmails(whitelistedEmails.filter(e => e !== email));
  };

  const handleSubmit = () => {
    onCreateShareLink({
      visibility,
      expiry,
      whitelistedEmails: visibility === 'private' ? whitelistedEmails : null,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Share Link</DialogTitle>
          <DialogDescription>
            Create a shareable link for your video with custom settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="visibility">Link Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(val: ShareVisibility) => setVisibility(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public (Anyone with the link)</SelectItem>
                <SelectItem value="private">Private (Whitelisted emails only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry">Link Expiration</Label>
            <Select
              value={expiry}
              onValueChange={(val: ShareExpiry) => setExpiry(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="12h">12 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="forever">Never Expires</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {visibility === 'private' && (
            <div className="space-y-2">
              <Label htmlFor="emails">Authorized Emails</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="emails"
                  type="email"
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" size="icon" onClick={handleAddEmail}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {whitelistedEmails.length > 0 && (
                <div className="border rounded-md p-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {whitelistedEmails.map((email) => (
                      <Badge key={email} variant="secondary" className="flex items-center gap-1">
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Share Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinkForm;
