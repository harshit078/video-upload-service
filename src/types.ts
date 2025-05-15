export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export type VideoStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  status: VideoStatus;
  progress?: number;
  duration?: number;
  fileSize: number;
  format?: string;
  resolution?: string;
  bitrate?: number;
}

export interface VideoShare {
  id: string;
  videoId: string;
  userId: string;
  sharedWith: string[];
  createdAt: string;
  expiresAt?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VideoLike {
  id: string;
  videoId: string;
  userId: string;
  createdAt: string;
}

export interface VideoView {
  id: string;
  videoId: string;
  userId: string;
  createdAt: string;
  duration: number;
}

export type ShareVisibility = 'public' | 'private';

export type ShareExpiry = '1h' | '12h' | '1d' | '7d' | '30d' | 'forever';

export interface ShareLink {
  id: string;
  videoId: string;
  slug: string;
  visibility: ShareVisibility;
  expiry: ShareExpiry;
  expiresAt: string | null;
  createdAt: string;
  lastViewedAt: string | null;
  whitelistedEmails: string[] | null;
  isExpired: boolean;
}
