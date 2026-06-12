import { Record, UserStats } from '@/types/records';

export const mockRecords: Record[] = [
  {
    id: 'r1',
    type: 'journey',
    date: '2026-06-08',
    partnerName: '小美',
    partnerAvatar: 'https://picsum.photos/id/177/200/200',
    activity: '商场试衣参考',
    duration: '1小时',
    rating: 5.0,
    status: 'completed',
    evaluation: {
      rating: 5.0,
      comment: '非常专业的穿搭建议，人也很温柔',
      tags: ['专业', '友好', '准时']
    }
  },
  {
    id: 'r2',
    type: 'journey',
    date: '2026-06-01',
    partnerName: '老张',
    partnerAvatar: 'https://picsum.photos/id/237/200/200',
    activity: '公园慢走',
    duration: '1小时',
    rating: 4.8,
    status: 'completed',
    evaluation: {
      rating: 4.8,
      comment: '聊天很愉快，下次还想一起散步',
      tags: ['健谈', '准时', '有趣']
    }
  },
  {
    id: 'r3',
    type: 'journey',
    date: '2026-05-25',
    partnerName: '艺术青年',
    partnerAvatar: 'https://picsum.photos/id/338/200/200',
    activity: '陪看当代艺术展',
    duration: '2小时',
    status: 'completed'
  },
  {
    id: 'r4',
    type: 'journey',
    date: '2026-05-18',
    partnerName: '未知用户',
    partnerAvatar: 'https://picsum.photos/id/91/200/200',
    activity: '咖啡厅聊天',
    duration: '1小时',
    status: 'cancelled'
  }
];

export const mockUserStats: UserStats = {
  totalHours: 15,
  totalTimes: 12,
  averageRating: 4.7,
  tags: ['准时', '健谈', '友好', '专业']
};

export const mockReviews = [
  {
    id: 'rev1',
    from: '小美',
    avatar: 'https://picsum.photos/id/177/200/200',
    rating: 5.0,
    comment: '非常专业的穿搭建议，人也很温柔',
    tags: ['专业', '友好', '准时'],
    date: '2026-06-08'
  },
  {
    id: 'rev2',
    from: '老张',
    avatar: 'https://picsum.photos/id/237/200/200',
    rating: 4.8,
    comment: '聊天很愉快，下次还想一起散步',
    tags: ['健谈', '准时', '有趣'],
    date: '2026-06-01'
  },
  {
    id: 'rev3',
    from: '艺术青年',
    avatar: 'https://picsum.photos/id/338/200/200',
    rating: 4.5,
    comment: '对艺术有独到见解，聊得很开心',
    tags: ['专业', '准时'],
    date: '2026-05-25'
  }
];

export const privacyOptions = [
  {
    id: 'profile',
    label: '隐藏个人主页',
    description: '其他用户无法查看你的个人主页',
    checked: false
  },
  {
    id: 'history',
    label: '隐藏历史记录',
    description: '其他用户无法查看你的历史行程',
    checked: false
  },
  {
    id: 'rating',
    label: '隐藏评分',
    description: '其他用户无法查看你的评分',
    checked: false
  }
];
