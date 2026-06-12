import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Record } from '@/types/records';

interface RecordCardProps {
  record: Record;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const statusMap = {
    completed: { text: '已完成', color: '#00B894' },
    cancelled: { text: '已取消', color: '#E17055' },
    reported: { text: '已举报', color: '#FDCB6E' }
  };
  const status = statusMap[record.status];

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/record-detail/index?id=${record.id}`
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Image
          src={record.partnerAvatar}
          className={styles.avatar}
          mode="aspectFill"
        />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.partnerName}>{record.partnerName}</Text>
            <View className={styles.statusTag} style={{ backgroundColor: status.color }}>
              <Text className={styles.statusText}>{status.text}</Text>
            </View>
          </View>
          <Text className={styles.activity}>{record.activity}</Text>
        </View>
      </View>

      <View className={styles.detail}>
        <View className={styles.detailItem}>
          <Text className={styles.detailLabel}>日期</Text>
          <Text className={styles.detailValue}>{record.date}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailLabel}>时长</Text>
          <Text className={styles.detailValue}>{record.duration}</Text>
        </View>
        {record.rating && (
          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>评分</Text>
            <Text className={styles.ratingValue}>⭐ {record.rating}</Text>
          </View>
        )}
      </View>

      {record.evaluation && (
        <View className={styles.evaluation}>
          <Text className={styles.evaluationLabel}>评价：</Text>
          <Text className={styles.evaluationText}>{record.evaluation.comment}</Text>
          <View className={styles.tagList}>
            {record.evaluation.tags.map((tag, index) => (
              <View key={index} className={styles.tag}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default RecordCard;
