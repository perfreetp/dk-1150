import React, { useState } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ActionButton from '@/components/ActionButton';
import ActionButtonGroup from '@/components/ActionButtonGroup';
import { mockJourneys, journeyActions } from '@/data/mockJourneys';
import { Journey } from '@/types/journey';

const JourneyPage: React.FC = () => {
  const [journeys] = useState<Journey[]>(mockJourneys);
  const [note, setNote] = useState('');

  const currentJourney = journeys.find(j => j.status === 'ongoing' || j.status === 'confirmed');

  const statusMap = {
    confirmed: '已确认',
    arrived: '已到达',
    ongoing: '进行中',
    paused: '已暂停',
    completed: '已完成'
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'voice':
        Taro.showModal({
          title: '语音确认',
          content: '拨打给对方进行语音确认身份',
          success: (res) => {
            if (res.confirm) {
              Taro.makePhoneCall({
                phoneNumber: currentJourney?.partnerInfo.phone || ''
              });
            }
          }
        });
        break;
      case 'location':
        Taro.showToast({
          title: '定位已开启',
          icon: 'success'
        });
        break;
      case 'code':
        Taro.showModal({
          title: '约定暗号',
          content: `与${currentJourney?.partnerInfo.name}约定的暗号是：${currentJourney?.secretCode}`,
          showCancel: false
        });
        break;
      case 'reminder':
        Taro.showToast({
          title: '已发送提醒',
          icon: 'success'
        });
        break;
      case 'end':
        Taro.showModal({
          title: '确认提前结束',
          content: '确定要提前结束本次行程吗？',
          success: (res) => {
            if (res.confirm) {
              Taro.showToast({
                title: '行程已结束',
                icon: 'success'
              });
            }
          }
        });
        break;
      case 'extend':
        Taro.showModal({
          title: '补时申请',
          content: '申请延长30分钟',
          success: (res) => {
            if (res.confirm) {
              Taro.showToast({
                title: '已发送申请',
                icon: 'success'
              });
            }
          }
        });
        break;
      case 'note':
        Taro.showToast({
          title: '添加笔记成功',
          icon: 'success'
        });
        setNote('');
        break;
      case 'photo':
        Taro.chooseImage({
          count: 1,
          success: () => {
            Taro.showToast({
              title: '照片已保存',
              icon: 'success'
            });
          }
        });
        break;
    }
  };

  const handleEvaluate = () => {
    Taro.showToast({
      title: '评价成功',
      icon: 'success'
    });
  };

  const onPullDownRefresh = () => {
    setTimeout(() => {
      Taro.showToast({
        title: '刷新成功',
        icon: 'success'
      });
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  if (!currentJourney) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>行程中</Text>
          <Text className={styles.subtitle}>当前没有进行中的行程</Text>
        </View>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🚶</Text>
          <Text className={styles.emptyTitle}>暂无行程</Text>
          <Text className={styles.emptyText}>
            去"快速匹配"找一个陪伴伙伴吧
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>行程中</Text>
        <Text className={styles.subtitle}>正在与{currentJourney.partnerInfo.name}的行程</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.journeyCard}>
          <View className={styles.cardHeader}>
            <View className={styles.statusBadge}>
              <Text className={styles.statusText}>{statusMap[currentJourney.status]}</Text>
            </View>
            {currentJourney.isOverdue && (
              <Text className={styles.countdown}>
                已超时 {currentJourney.overdueMinutes} 分钟
              </Text>
            )}
          </View>

          <View className={styles.partnerInfo}>
            <Image
              src={currentJourney.partnerInfo.avatar}
              className={styles.avatar}
              mode="aspectFill"
            />
            <View className={styles.partnerDetail}>
              <Text className={styles.partnerName}>{currentJourney.partnerInfo.name}</Text>
              <Text className={styles.partnerMeta}>⭐ {currentJourney.partnerInfo.rating} · 已认证</Text>
            </View>
            <View className={styles.callButton}>
              <Text className={styles.callIcon}>📞</Text>
            </View>
          </View>

          <View className={styles.journeyInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📅</Text>
              <Text className={styles.infoText}>
                {currentJourney.requestInfo.timeSlot.date} {currentJourney.requestInfo.timeSlot.startTime}-{currentJourney.requestInfo.timeSlot.endTime}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📍</Text>
              <Text className={styles.infoText}>{currentJourney.requestInfo.location.name}</Text>
            </View>
          </View>

          {currentJourney.secretCode && (
            <View className={styles.secretCode}>
              <Text className={styles.codeLabel}>暗号：</Text>
              <Text className={styles.codeText}>{currentJourney.secretCode}</Text>
            </View>
          )}
        </View>

        <View className={styles.actionSection}>
          <Text className={styles.sectionTitle}>行程操作</Text>
          <ActionButtonGroup actions={journeyActions} onAction={handleAction} />
        </View>

        <View className={styles.noteSection}>
          <Text className={styles.noteTitle}>行程笔记</Text>
          {currentJourney.notes.length > 0 && (
            <View style={{ marginBottom: '16rpx' }}>
              {currentJourney.notes.map((note, index) => (
                <View key={index} style={{ marginBottom: '8rpx' }}>
                  <Text style={{ fontSize: '28rpx', color: '#636E72' }}>• {note}</Text>
                </View>
              ))}
            </View>
          )}
          <Textarea
            className={styles.noteInput}
            placeholder="记录本次行程的感受..."
            value={note}
            onInput={(e) => setNote(e.detail.value)}
          />
          <View style={{ marginTop: '16rpx', display: 'flex', justifyContent: 'flex-end' }}>
            <ActionButton
              text="添加笔记"
              type="secondary"
              size="small"
              onClick={() => handleAction('note')}
            />
          </View>
        </View>

        {currentJourney.photos.length > 0 && (
          <View className={styles.noteSection}>
            <Text className={styles.noteTitle}>行程照片</Text>
            <View className={styles.photoGrid}>
              {currentJourney.photos.map((photo, index) => (
                <View key={index} className={styles.photoItem}>
                  <Image src={photo} className={styles.photo} mode="aspectFill" />
                </View>
              ))}
            </View>
          </View>
        )}

        {currentJourney.status === 'completed' && (
          <View className={styles.evaluateButton}>
            <ActionButton
              text="去评价"
              type="primary"
              size="large"
              fullWidth
              onClick={handleEvaluate}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default JourneyPage;
