import { MatchRequest } from '@/types/match';

export const mockMatchRequests: MatchRequest[] = [
  {
    id: 'm1',
    type: 'exhibition',
    title: '周末看现代艺术展',
    description: '想找人一起看798的现代艺术展，互相交流观展感受',
    timeSlot: {
      date: '2026-06-15',
      startTime: '14:00',
      endTime: '15:00'
    },
    location: {
      name: '798艺术区',
      address: '北京市朝阳区酒仙桥路4号'
    },
    genderPreference: 'any',
    costType: 'aa',
    chatBoundary: '可以讨论艺术作品，避免敏感话题',
    userInfo: {
      name: '艺术爱好者小王',
      avatar: 'https://picsum.photos/id/338/200/200',
      gender: 'male',
      rating: 4.9,
      verified: true
    },
    createdAt: '2026-06-13T10:00:00Z'
  },
  {
    id: 'm2',
    type: 'park',
    title: '公园散步聊天',
    description: '工作压力大，想找人一起在公园散步放松',
    timeSlot: {
      date: '2026-06-14',
      startTime: '09:00',
      endTime: '10:00'
    },
    location: {
      name: '奥林匹克森林公园',
      address: '北京市朝阳区科荟路33号'
    },
    genderPreference: 'female',
    costType: 'free',
    chatBoundary: '轻松聊天，分享生活趣事',
    userInfo: {
      name: '阳光女孩',
      avatar: 'https://picsum.photos/id/175/200/200',
      gender: 'female',
      rating: 4.7,
      verified: true
    },
    createdAt: '2026-06-12T18:00:00Z'
  },
  {
    id: 'm3',
    type: 'shopping',
    title: '帮忙参考穿搭',
    description: '换季买衣服，需要有人帮忙看看搭配',
    timeSlot: {
      date: '2026-06-15',
      startTime: '15:00',
      endTime: '16:00'
    },
    location: {
      name: '三里屯太古里',
      address: '北京市朝阳区三里屯路19号'
    },
    genderPreference: 'female',
    costType: 'treat',
    chatBoundary: '帮忙给穿搭建议就好',
    userInfo: {
      name: '时尚达人',
      avatar: 'https://picsum.photos/id/164/200/200',
      gender: 'female',
      rating: 4.8,
      verified: false
    },
    createdAt: '2026-06-11T14:00:00Z'
  },
  {
    id: 'm4',
    type: 'pet',
    title: '一起遛柯基',
    description: '我家柯基太活泼，需要有人陪我一起遛',
    timeSlot: {
      date: '2026-06-14',
      startTime: '18:00',
      endTime: '19:00'
    },
    location: {
      name: '望京SOHO楼下',
      address: '北京市朝阳区望京街10号'
    },
    genderPreference: 'any',
    costType: 'free',
    chatBoundary: '喜欢狗狗的朋友一起来玩',
    userInfo: {
      name: '柯基铲屎官',
      avatar: 'https://picsum.photos/id/433/200/200',
      gender: 'male',
      rating: 4.6,
      verified: true
    },
    createdAt: '2026-06-10T20:00:00Z'
  },
  {
    id: 'm5',
    type: 'other',
    title: '咖啡厅读书会',
    description: '找个安静咖啡厅，一起看书或者工作',
    timeSlot: {
      date: '2026-06-16',
      startTime: '14:00',
      endTime: '15:00'
    },
    location: {
      name: 'PageOne书店',
      address: '北京市朝阳区建国路88号'
    },
    genderPreference: 'any',
    costType: 'aa',
    chatBoundary: '安静看书，可以简单交流',
    userInfo: {
      name: '书虫',
      avatar: 'https://picsum.photos/id/219/200/200',
      gender: 'female',
      rating: 5.0,
      verified: true
    },
    createdAt: '2026-06-09T11:00:00Z'
  },
  {
    id: 'm6',
    type: 'exhibition',
    title: '博物馆半日游',
    description: '国家博物馆看展，寻找有共同兴趣的朋友',
    timeSlot: {
      date: '2026-06-15',
      startTime: '10:00',
      endTime: '11:00'
    },
    location: {
      name: '国家博物馆',
      address: '北京市东城区东长安街16号'
    },
    genderPreference: 'any',
    costType: 'aa',
    chatBoundary: '可以讨论展品和历史',
    userInfo: {
      name: '历史迷',
      avatar: 'https://picsum.photos/id/342/200/200',
      gender: 'male',
      rating: 4.5,
      verified: true
    },
    createdAt: '2026-06-08T16:00:00Z'
  }
];
