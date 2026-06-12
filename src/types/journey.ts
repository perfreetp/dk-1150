export interface Journey {
  id: string;
  requestId: string;
  requestInfo: {
    type: 'exhibition' | 'park' | 'shopping' | 'pet' | 'other';
    title: string;
    timeSlot: {
      date: string;
      startTime: string;
      endTime: string;
    };
    location: {
      name: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };
  };
  partnerInfo: {
    name: string;
    avatar: string;
    gender: 'male' | 'female';
    phone?: string;
    rating: number;
  };
  status: 'confirmed' | 'arrived' | 'ongoing' | 'paused' | 'completed';
  secretCode?: string;
  notes: string[];
  photos: string[];
  startTime?: string;
  endTime?: string;
  actualDuration?: number;
  isOverdue: boolean;
  overdueMinutes?: number;
}
