
export enum AppView {
  INBOX = 'reader',
  WRITER = 'writer',
  DRAFTS = 'drafts',
  PRIVATE_DROPS = 'private_drops',
  FOLLOWING = 'following',
  MY_DROPS = 'my_drops',
  SETTINGS = 'settings'
}

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  publicKey?: string;

  // Preferences
  batchMode?: 'Instant' | 'Daily' | 'Weekly' | 'Custom';
  batchDate?: string;
  batchTime?: string;
  doubleSided?: boolean;
  printColorMode?: 'color' | 'bw';
  theme?: 'light' | 'dark' | 'system';
  allowPrivateDrops?: boolean;
  privateLineExceptions?: string[];
  socialLinks?: { label: string; url: string }[];
}

export interface Comment {
  id: string;
  authorHandle: string;
  authorName?: string;
  avatar?: string;
  text: string;
  timestamp: number; // Converted from created_at
  parentId?: string;
  likes: number;
  liked: boolean;
}

export interface Drop {
  id: string;
  author: string;
  authorHandle: string;
  authorAvatar?: string;
  title: string;
  content: string;
  timestamp: number; // Converted from created_at
  status: 'received' | 'printed' | 'queued';
  layout?: 'classic' | 'zine' | 'minimal';
  likes: number;
  liked: boolean;
  comments: number;
  printCount?: number;
  commentList?: Comment[];
}

export interface Draft {
  id: string;
  title: string;
  content: string;
  layout: 'classic' | 'zine' | 'minimal';
  updatedAt: number;
}

export interface PrivateDrop {
  id: string;
  senderId: string;
  senderHandle: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  encryptedTitle: string;
  encryptedContent: string;
  rawTitle?: string;
  rawContent?: string;
  counterpartPublicKey?: string;
  timestamp: number;
  readAt?: number;
  status?: 'pending' | 'accepted' | 'denied' | 'received' | 'printed' | 'queued';
}

export interface PrivateContact {
  userId: string;
  contactId: string;
  autoPrint: boolean;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  followerCount: number;
  isFollowing: boolean;
  autoPrint: boolean;
  avatar: string;
  socialLinks?: { label: string; url: string }[];
}

export interface PrinterState {
  isConnected: boolean;
  name: string;
  isPrinting: boolean;
  currentJob?: string;
}
