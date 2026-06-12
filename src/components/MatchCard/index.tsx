import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { MatchRequest } from '@/types/match';
import { requestTypeOptions } from '@/data/mockWeekendRequests';
import ActionButton from '@/components/ActionButton';

interface MatchRequestWithStatus extends MatchRequest {
  status?: 'available' | 'accepted' | 'rejected';
}

interface MatchCardProps {
  request: MatchRequestWithStatus;
  onAccept?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ request, onAccept }) => {
  const typeInfo = requestTypeOptions.find(opt => opt.value === request.type);
  const status = request.status || 'available';

  const costMap = {
    free: '免费',
    aa: 'AA',
    treat: '我请客'
  };

  const handleClick = () => {
    if (status === 'available') {
      Taro.navigateTo({
        url: `/pages/invite/index?id=${request.id}&type=match`
      });
    }
  };

  const handleAccept = (e) => {
    e.stopPropagation();
    if (onAccept) {
      onAccept();
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image
            src={request.userInfo.avatar}
            className={styles.avatar}
            mode="aspectFill"
          />
          <View className={styles.userDetail}>
            <View className={styles.nameRow}>
              <Text className={styles.userName}>{request.userInfo.name}</Text>
              {request.userInfo.verified && (
                <View className={styles.verifiedBadge}>
                  <Text className={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text className={styles.rating}>⭐ {request.userInfo.rating}</Text>
          </View>
        </View>
        <View className={styles.typeTag}>
          <Text className={styles.typeIcon}>{typeInfo?.icon}</Text>
          <Text className={styles.typeText}>{typeInfo?.label}</Text>
        </View>
      </View>

      <Text className={styles.title}>{request.title}</Text>
      <Text className={styles.description}>{request.description}</Text>

      <View className={styles.infoRow}>
        <View className={styles.infoItem}>
          <Text className={styles.infoIcon}>📅</Text>
          <Text className={styles.infoText}>
            {request.timeSlot.date} {request.timeSlot.startTime}-{request.timeSlot.endTime}
          </Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoIcon}>📍</Text>
          <Text className={styles.infoText}>{request.location.name}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.costBadge}>
          <Text className={styles.costText}>{costMap[request.costType]}</Text>
        </View>
        {status === 'available' && (
          <ActionButton
            text="接单"
            type="primary"
            size="small"
            onClick={handleAccept}
          />
        )}
        {status === 'accepted' && (
          <View className={styles.acceptedBadge}>
            <Text className={styles.acceptedText}>✓ 已接单</Text>
          </View>
        )}
        {status === 'rejected' && (
          <View className={styles.rejectedBadge}>
            <Text className={styles.rejectedText}>已拒绝</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MatchCard;
