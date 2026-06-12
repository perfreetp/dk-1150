import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Record } from '@/types/records';
import { Journey } from '@/types/journey';
import { storage } from '@/utils/storage';
import { mockRecords } from '@/data/mockRecords';

interface TimelineEvent {
  time: string;
  type: string;
  content: string;
  icon: string;
}

const RecordDetailPage: React.FC = () => {
  const router = useRouter();
  const [record, setRecord] = useState<Record | null>(null);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = router.params;

    setTimeout(() => {
      const savedRecords = storage.getRecords();
      const savedJourneys = storage.getJourneys();
      
      const foundRecord = savedRecords.find(r => r.id === id) || 
                         mockRecords.find(r => r.id === id);
      
      const foundJourney = savedJourneys.find(j => 
        j.requestId === foundRecord?.activity || 
        j.requestInfo.title === foundRecord?.activity
      );
      
      setRecord(foundRecord || null);
      setJourney(foundJourney || null);
      setLoading(false);
    }, 300);
  }, [router.params]);

  const getTimelineEvents = (): TimelineEvent[] => {
    if (!journey) return [];
    
    const events: TimelineEvent[] = [];
    
    if (journey.status === 'confirmed' || journey.status === 'ongoing' || journey.status === 'completed') {
      events.push({
        time: journey.requestInfo.timeSlot.startTime,
        type: 'confirm',
        content: '行程已确认',
        icon: '✅'
      });
    }
    
    if (journey.startTime) {
      events.push({
        time: new Date(journey.startTime).toLocaleTimeString(),
        type: 'start',
        content: '确认出发，行程开始',
        icon: '🚀'
      });
    }
    
    journey.notes.forEach(note => {
      let icon = '📝';
      
      if (note.includes('开启了位置共享')) {
        icon = '📍';
      } else if (note.includes('关闭了位置共享')) {
        icon = '🔒';
      } else if (note.includes('拍摄了一张照片')) {
        icon = '📷';
      } else if (note.includes('提前结束')) {
        icon = '🏁';
      } else if (note.includes('申请延长')) {
        icon = '⏰';
      }
      
      const timeMatch = note.match(/\[(.*?)\]/);
      events.push({
        time: timeMatch ? timeMatch[1] : '',
        type: 'note',
        content: note,
        icon
      });
    });
    
    if (journey.endTime) {
      events.push({
        time: new Date(journey.endTime).toLocaleTimeString(),
        type: 'end',
        content: '行程已结束',
        icon: '🏁'
      });
    }
    
    return events.sort((a, b) => {
      if (!a.time || !b.time) return 0;
      const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
      const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  };

  const handlePreviewPhoto = (photoUrl: string) => {
    const photos = journey?.photos || record?.evaluation?.comment ? [photoUrl] : [];
    if (photos.length > 0) {
      Taro.previewImage({
        urls: photos,
        current: photoUrl
      });
    }
  };

  if (loading) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyTitle}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!record) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>❓</Text>
          <Text className={styles.emptyTitle}>记录不存在</Text>
          <Text className={styles.emptyText}>该行程记录已被删除</Text>
        </View>
      </View>
    );
  }

  const timelineEvents = getTimelineEvents();

  return (
    <View className={styles.container}>
      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>
            伙伴信息
          </Text>
          <View className={styles.partnerCard}>
            <Image
              src={record.partnerAvatar}
              className={styles.avatar}
              mode="aspectFill"
            />
            <View className={styles.partnerInfo}>
              <Text className={styles.partnerName}>{record.partnerName}</Text>
              <Text className={styles.partnerMeta}>{record.activity}</Text>
              {record.rating && (
                <Text className={styles.rating}>⭐ {record.rating}</Text>
              )}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📅</Text>
            行程信息
          </Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>日期</Text>
              <Text className={styles.infoValue}>{record.date}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>时长</Text>
              <Text className={styles.infoValue}>{record.duration}</Text>
            </View>
            {journey && (
              <>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>集合地点</Text>
                  <Text className={styles.infoValue}>{journey.requestInfo.location.name}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>状态</Text>
                  <Text className={styles.infoValue}>已完成</Text>
                </View>
              </>
            )}
          </View>
          {journey && (
            <Text className={styles.locationText}>{journey.requestInfo.location.address}</Text>
          )}
        </View>

        {record.evaluation && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>⭐</Text>
              评价
            </Text>
            <View className={styles.evaluationCard}>
              <View className={styles.evaluationHeader}>
                <Text className={styles.evaluationRating}>
                  ⭐ {record.evaluation.rating}
                </Text>
                <Text className={styles.evaluationDate}>{record.date}</Text>
              </View>
              <Text className={styles.evaluationText}>{record.evaluation.comment}</Text>
              <View className={styles.tagList}>
                {record.evaluation.tags.map((tag, index) => (
                  <View key={index} className={styles.tag}>
                    <Text className={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {journey && journey.notes.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📜</Text>
              行程时间线
            </Text>
            <View className={styles.timeline}>
              {timelineEvents.map((event, index) => (
                <View key={index} className={styles.timelineItem}>
                  <View className={styles.timelineDot}>
                    <Text className={styles.timelineIcon}>{event.icon}</Text>
                  </View>
                  <View className={styles.timelineContent}>
                    {event.time && (
                      <Text className={styles.timelineTime}>{event.time}</Text>
                    )}
                    <Text className={styles.timelineText}>{event.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {journey && journey.photos.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📷</Text>
              行程照片
            </Text>
            <View className={styles.photoGrid}>
              {journey.photos.map((photo, index) => (
                <View 
                  key={index} 
                  className={styles.photoItem}
                  onClick={() => handlePreviewPhoto(photo)}
                >
                  <Image src={photo} className={styles.photo} mode="aspectFill" />
                </View>
              ))}
            </View>
          </View>
        )}

        {(!journey || (journey.notes.length === 0 && journey.photos.length === 0)) && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📝</Text>
              备注
            </Text>
            <Text className={styles.emptyPhotos}>暂无详细信息</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RecordDetailPage;
