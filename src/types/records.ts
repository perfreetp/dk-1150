import { WeekendRequest } from '@/types/weekend';
import { MatchRequest } from '@/types/match';

export interface Record {
  id: string;
  type: 'request' | 'journey';
  date: string;
  partnerName: string;
  partnerAvatar: string;
  activity: string;
  duration: string;
  rating?: number;
  comment?: string;
  status: 'completed' | 'cancelled' | 'reported';
  evaluation?: {
    rating: number;
    comment: string;
    tags: string[];
  };
}

export interface UserStats {
  totalHours: number;
  totalTimes: number;
  averageRating: number;
  tags: string[];
}
