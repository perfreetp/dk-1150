export interface MatchRequest {
  id: string;
  type: 'exhibition' | 'park' | 'shopping' | 'pet' | 'other';
  title: string;
  description: string;
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  location: {
    name: string;
    address: string;
  };
  genderPreference: 'male' | 'female' | 'any';
  costType: 'free' | 'aa' | 'treat';
  chatBoundary: string;
  userInfo: {
    name: string;
    avatar: string;
    gender: 'male' | 'female';
    rating: number;
    verified: boolean;
  };
  createdAt: string;
}
