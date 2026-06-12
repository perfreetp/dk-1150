import { WeekendRequest } from '@/types/weekend';

export const mockWeekendRequests: WeekendRequest[] = [
  {
    id: '1',
    type: 'exhibition',
    title: '陪看当代艺术展',
    description: '周末想去798看当代艺术展，寻找有共同兴趣的朋友一起',
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
    },
    genderPreference: 'any',
    costType: 'aa',
    chatBoundary: '可以简单交流观展感受，避免深入私人话题',
    status: 'matched',
    createdAt: '2026-06-10T10:00:00Z',
    matchedUser: {
      name: '小林',
      avatar: 'https://picsum.photos/id/64/200/200',
      gender: 'female',
      rating: 4.8
    }
  },
  {
    id: '2',
    type: 'park',
    title: '公园慢走放松',
    description: '工作压力大，想找人一起公园散步聊聊天',
    timeSlot: {
      date: '2026-06-15',
      startTime: '09:00',
      endTime: '10:00'
    },
    location: {
      name: '朝阳公园',
      address: '北京市朝阳区农展南路',
      latitude: 39.937,
      longitude: 116.467
    },
    genderPreference: 'female',
    costType: 'free',
    chatBoundary: '轻松聊天，分享生活',
    status: 'pending',
    createdAt: '2026-06-11T08:00:00Z'
  },
  {
    id: '3',
    type: 'shopping',
    title: '商场试衣参考',
    description: '换季买衣服需要有人帮忙参考搭配',
    timeSlot: {
      date: '2026-06-14',
      startTime: '16:00',
      endTime: '17:00'
    },
    location: {
      name: '三里屯太古里',
      address: '北京市朝阳区三里屯路19号',
      latitude: 39.935,
      longitude: 116.448
    },
    genderPreference: 'female',
    costType: 'treat',
    chatBoundary: '试衣服给建议就好',
    status: 'completed',
    createdAt: '2026-06-08T15:00:00Z',
    matchedUser: {
      name: '小美',
      avatar: 'https://picsum.photos/id/177/200/200',
      gender: 'female',
      rating: 5.0
    }
  },
  {
    id: '4',
    type: 'pet',
    title: '宠物陪遛',
    description: '我家柯基太活泼了，需要有人陪我一起遛',
    timeSlot: {
      date: '2026-06-15',
      startTime: '18:00',
      endTime: '19:00'
    },
    location: {
      name: '望京SOHO楼下',
      address: '北京市朝阳区望京街10号',
      latitude: 39.996,
      longitude: 116.469
    },
    genderPreference: 'any',
    costType: 'free',
    chatBoundary: '喜欢狗狗的朋友一起来玩',
    status: 'pending',
    createdAt: '2026-06-12T20:00:00Z'
  },
  {
    id: '5',
    type: 'other',
    title: '咖啡厅聊天',
    description: '周末下午找个咖啡厅坐着聊聊天',
    timeSlot: {
      date: '2026-06-16',
      startTime: '15:00',
      endTime: '16:00'
    },
    location: {
      name: '星巴克臻选',
      address: '北京市朝阳区建国路88号',
      latitude: 39.909,
      longitude: 116.456
    },
    genderPreference: 'any',
    costType: 'aa',
    chatBoundary: '随意聊天，交个朋友',
    status: 'ongoing',
    createdAt: '2026-06-13T09:00:00Z',
    matchedUser: {
      name: '阿杰',
      avatar: 'https://picsum.photos/id/91/200/200',
      gender: 'male',
      rating: 4.6
    }
  }
];

export const requestTypeOptions = [
  { value: 'exhibition', label: '陪看展', icon: '🎨' },
  { value: 'park', label: '公园慢走', icon: '🌳' },
  { value: 'shopping', label: '商场试衣', icon: '🛍️' },
  { value: 'pet', label: '宠物陪遛', icon: '🐕' },
  { value: 'other', label: '其他', icon: '☕' }
];

export const timeSlotOptions = [
  { value: '09:00', label: '上午9点' },
  { value: '10:00', label: '上午10点' },
  { value: '11:00', label: '上午11点' },
  { value: '14:00', label: '下午2点' },
  { value: '15:00', label: '下午3点' },
  { value: '16:00', label: '下午4点' },
  { value: '17:00', label: '下午5点' },
  { value: '18:00', label: '下午6点' },
  { value: '19:00', label: '晚上7点' }
];

export const genderOptions = [
  { value: 'any', label: '不限' },
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
];

export const costOptions = [
  { value: 'free', label: '免费' },
  { value: 'aa', label: 'AA' },
  { value: 'treat', label: '我请客' }
];
