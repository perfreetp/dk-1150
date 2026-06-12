import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { WeekendRequest } from '@/types/weekend';
import { requestTypeOptions } from '@/data/mockWeekendRequests';

interface RequestCardProps {
  request: WeekendRequest;
  onClick?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const typeInfo = requestTypeOptions.find(opt => opt.value === request.type);
  const statusMap = {
    pending: { text: '待匹配', color: '#FDCB6E' },
    matched: { text: '已匹配', color: '#00B894' },
    ongoing: { text: '进行中', color: '#4ECDC4' },
    completed: { text: '已完成', color: '#636E72' },
    cancelled: { text: '已取消', color: '#E17055' }
  };
  const status = statusMap[request.status];

  const costMap = {
    free: '免费',
    aa: 'AA',
    treat: '我请客'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/invite/index?id=${request.id}&type=weekend`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.typeTag}>
          <Text className={styles.typeIcon}>{typeInfo?.icon}</Text>
          <Text className={styles.typeText}>{typeInfo?.label}</Text>
        </View>
        <View className={styles.statusTag} style={{ backgroundColor: status.color }}>
          <Text className={styles.statusText}>{status.text}</Text>
        </View>
      </View>

      <Text className={styles.title}>{request.title}</Text>
      <Text className={styles.description}>{request.description}</Text>

      <View className={styles.infoRow}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>📅</Text>
          <Text className={styles.infoText}>
            {request.timeSlot.date} {request.timeSlot.startTime}-{request.timeSlot.endTime}
          </Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>📍</Text>
          <Text className={styles.infoText}>{request.location.name}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.costBadge}>
          <Text className={styles.costText}>{costMap[request.costType]}</Text>
        </View>
        {request.matchedUser && (
          <View className={styles.userInfo}>
            <Image
              src={request.matchedUser.avatar}
              className={styles.userAvatar}
              mode="aspectFill"
            />
            <Text className={styles.userName}>{request.matchedUser.name}</Text>
            <Text className={styles.userRating}>⭐ {request.matchedUser.rating}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RequestCard;
