
export enum AppView {
  READER = 'reader',
  WRITER = 'writer',
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

  // Preferences
  batchMode?: 'Instant' | 'Daily' | 'Weekly' | 'Custom';
  batchDate?: string;
  batchTime?: string;
  paperSaver?: boolean;
}

export interface Comment {
  id: string;
  authorHandle: string;
  authorName?: string;
  text: string;
  timestamp: number; // Converted from created_at
}

export interface Drop {
  id: string;
  author: string;
  authorHandle: string;
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

export interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  followerCount: number;
  isFollowing: boolean;
  autoPrint: boolean;
  avatar: string;
}

export interface PrinterState {
  isConnected: boolean;
  name: string;
  isPrinting: boolean;
  currentJob?: string;
}
