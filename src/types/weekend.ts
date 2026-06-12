export interface WeekendRequest {
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
    latitude?: number;
    longitude?: number;
  };
  genderPreference: 'male' | 'female' | 'any';
  costType: 'free' | 'aa' | 'treat';
  chatBoundary: string;
  status: 'pending' | 'matched' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  matchedUser?: {
    name: string;
    avatar: string;
    gender: 'male' | 'female';
    rating: number;
  };
}

export interface RequestFormData {
  type: WeekendRequest['type'];
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  genderPreference: WeekendRequest['genderPreference'];
  costType: WeekendRequest['costType'];
  chatBoundary: string;
}
