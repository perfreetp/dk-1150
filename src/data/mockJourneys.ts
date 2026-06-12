import { Journey } from '@/types/journey';

export const mockJourneys: Journey[] = [
  {
    id: 'j1',
    requestId: '1',
    requestInfo: {
      type: 'exhibition',
      title: '陪看当代艺术展',
      timeSlot: {
        date: '2026-06-14',
        startTime: '14:00',
        endTime: '15:00'
      },
      location: {
        name: '798艺术区',
        address: '北京市朝阳区酒仙桥路4号',
        latitude: 39.983,
        longitude: 116.495
      }
    },
    partnerInfo: {
      name: '小林',
      avatar: 'https://picsum.photos/id/64/200/200',
      gender: 'female',
      phone: '138****8888',
      rating: 4.8
    },
    status: 'confirmed',
    secretCode: '🎨',
    notes: [],
    photos: [],
    isOverdue: false
  },
  {
    id: 'j2',
    requestId: '5',
    requestInfo: {
      type: 'other',
      title: '咖啡厅聊天',
      timeSlot: {
        date: '2026-06-13',
        startTime: '15:00',
        endTime: '16:00'
      },
      location: {
        name: '星巴克臻选',
        address: '北京市朝阳区建国路88号',
        latitude: 39.909,
        longitude: 116.456
      }
    },
    partnerInfo: {
      name: '阿杰',
      avatar: 'https://picsum.photos/id/91/200/200',
      gender: 'male',
      phone: '139****6666',
      rating: 4.6
    },
    status: 'ongoing',
    notes: [
      '今天聊得很开心',
      '发现我们都是二次元爱好者'
    ],
    photos: [
      'https://picsum.photos/id/429/300/300'
    ],
    startTime: '2026-06-13T15:05:00Z',
    isOverdue: false
  }
];

export const journeyActions = [
  {
    id: 'voice',
    icon: '🎤',
    label: '语音确认',
    color: '#4ECDC4'
  },
  {
    id: 'location',
    icon: '📍',
    label: '共享定位',
    color: '#00B894'
  },
  {
    id: 'code',
    icon: '🤫',
    label: '约定暗号',
    color: '#FF6B6B'
  },
  {
    id: 'reminder',
    icon: '⏰',
    label: '迟到提醒',
    color: '#FDCB6E'
  },
  {
    id: 'end',
    icon: '🏁',
    label: '提前结束',
    color: '#E17055'
  },
  {
    id: 'extend',
    icon: '⏰',
    label: '补时申请',
    color: '#4ECDC4'
  },
  {
    id: 'note',
    icon: '📝',
    label: '行程笔记',
    color: '#636E72'
  },
  {
    id: 'photo',
    icon: '📷',
    label: '照片留存',
    color: '#FF6B6B'
  }
];
