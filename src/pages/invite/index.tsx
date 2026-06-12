import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import ActionButton from '@/components/ActionButton';
import { mockWeekendRequests } from '@/data/mockWeekendRequests';
import { mockMatchRequests } from '@/data/mockMatchRequests';
import { WeekendRequest } from '@/types/weekend';
import { MatchRequest } from '@/types/match';
import { Journey } from '@/types/journey';
import { storage } from '@/utils/storage';

const InvitePage: React.FC = () => {
  const router = useRouter();
  const [request, setRequest] = useState<WeekendRequest | MatchRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteStatus, setInviteStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  useEffect(() => {
    const { id, type } = router.params;

    setTimeout(() => {
      if (type === 'match') {
        const matchRequest = mockMatchRequests.find(r => r.id === id);
        setRequest(matchRequest || null);
      } else {
        const myRequests = storage.getMyRequests();
        const savedRequest = myRequests.find(r => r.id === id);
        if (savedRequest) {
          setRequest(savedRequest);
        } else {
          const weekendRequest = mockWeekendRequests.find(r => r.id === id);
          setRequest(weekendRequest || null);
        }
      }
      setLoading(false);
    }, 500);

    if (id) {
      const savedStatus = storage.getInviteStatus(id);
      if (savedStatus) {
        setInviteStatus(savedStatus);
      }
    }
  }, [router.params]);

  const requestTypeOptions = [
    { value: 'exhibition', label: '陪看展', icon: '🎨' },
    { value: 'park', label: '公园慢走', icon: '🌳' },
    { value: 'shopping', label: '商场试衣', icon: '🛍️' },
    { value: 'pet', label: '宠物陪遛', icon: '🐕' },
    { value: 'other', label: '其他', icon: '☕' }
  ];

  const typeInfo = request ? requestTypeOptions.find(opt => opt.value === request.type) : null;

  const costMap = {
    free: '免费',
    aa: 'AA',
    treat: '我请客'
  };

  const genderMap = {
    male: '男',
    female: '女',
    any: '不限'
  };

  const handleAccept = () => {
    if (!request) return;
    
    Taro.showModal({
      title: '确认接受',
      content: '确定要接受这个邀约吗？',
      success: (res) => {
        if (res.confirm) {
          const isMatchRequest = 'userInfo' in request;
          
          const newJourney: Journey = {
            id: `journey_${Date.now()}`,
            requestId: request.id,
            requestInfo: {
              type: request.type,
              title: request.title,
              timeSlot: request.timeSlot,
              location: request.location
            },
            partnerInfo: isMatchRequest ? {
              name: request.userInfo.name,
              avatar: request.userInfo.avatar,
              gender: request.userInfo.gender,
              phone: '138****8888',
              rating: request.userInfo.rating
            } : {
              name: '我',
              avatar: 'https://picsum.photos/id/64/200/200',
              gender: 'female' as const,
              rating: 4.8
            },
            status: 'confirmed',
            secretCode: '🎉',
            notes: [],
            photos: [],
            isOverdue: false
          };

          storage.addJourney(newJourney);
          storage.setCurrentJourney(newJourney);
          storage.setInviteStatus(request.id, 'accepted');
          
          if (isMatchRequest) {
            storage.updateMatchRequestStatus(request.id, 'accepted');
          }

          setInviteStatus('accepted');
          
          Taro.showToast({
            title: '已接受邀约',
            icon: 'success'
          });
          
          setTimeout(() => {
            Taro.switchTab({
              url: '/pages/journey/index'
            });
          }, 1500);
        }
      }
    });
  };

  const handleReject = () => {
    if (!request) return;
    
    Taro.showModal({
      title: '确认拒绝',
      content: '确定要拒绝这个邀约吗？',
      success: (res) => {
        if (res.confirm) {
          const isMatchRequest = 'userInfo' in request;
          
          storage.setInviteStatus(request.id, 'rejected');
          
          if (isMatchRequest) {
            storage.updateMatchRequestStatus(request.id, 'rejected');
          }

          setInviteStatus('rejected');
          
          Taro.eventCenter.trigger('onShow');
          
          Taro.showToast({
            title: '已拒绝',
            icon: 'none'
          });
          
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  if (loading) {
    return (
      <View className={styles.loading}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View className={styles.loading}>
        <Text className={styles.loadingText}>请求不存在</Text>
      </View>
    );
  }

  const isMatchRequest = 'userInfo' in request;

  return (
    <View className={styles.container}>
      <View className={styles.content}>
        <View className={styles.userCard}>
          <Image
            src={isMatchRequest ? request.userInfo.avatar : 'https://picsum.photos/id/64/200/200'}
            className={styles.avatar}
            mode="aspectFill"
          />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>
              {isMatchRequest ? request.userInfo.name : '我'}
            </Text>
            <Text className={styles.userMeta}>
              性别：{genderMap[isMatchRequest ? request.userInfo.gender : 'female']}
            </Text>
            <View className={styles.ratingRow}>
              <Text className={styles.rating}>
                ⭐ {isMatchRequest ? request.userInfo.rating : '4.8'}
              </Text>
              {isMatchRequest && request.userInfo.verified && (
                <View className={styles.verifiedBadge}>
                  <Text className={styles.verifiedText}>已认证</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className={styles.requestCard}>
          <View className={styles.cardHeader}>
            <View className={styles.typeTag}>
              <Text className={styles.typeIcon}>{typeInfo?.icon}</Text>
              <Text className={styles.typeText}>{typeInfo?.label}</Text>
            </View>
          </View>

          <Text className={styles.title}>{request.title}</Text>
          <Text className={styles.description}>{request.description}</Text>

          <View className={styles.infoSection}>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📅</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>时间</Text>
                <Text className={styles.infoValue}>
                  {request.timeSlot.date} {request.timeSlot.startTime}-{request.timeSlot.endTime}
                </Text>
              </View>
            </View>

            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📍</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>集合地点</Text>
                <Text className={styles.infoValue}>{request.location.name}</Text>
                <Text style={{ fontSize: '24rpx', color: '#636E72', marginTop: '8rpx' }}>
                  {request.location.address}
                </Text>
              </View>
            </View>

            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>👤</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>性别偏好</Text>
                <Text className={styles.infoValue}>
                  {genderMap[request.genderPreference]}
                </Text>
              </View>
            </View>

            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>💰</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>费用方式</Text>
                <Text className={styles.infoValue}>{costMap[request.costType]}</Text>
              </View>
            </View>
          </View>

          <View className={styles.boundaryCard}>
            <Text className={styles.boundaryLabel}>💬 聊天边界</Text>
            <Text className={styles.boundaryText}>{request.chatBoundary}</Text>
          </View>
        </View>
      </View>

      <View className={styles.actionButtons}>
        {inviteStatus === 'pending' && (
          <>
            <ActionButton
              text="拒绝"
              type="secondary"
              size="large"
              onClick={handleReject}
            />
            <ActionButton
              text="接受邀约"
              type="primary"
              size="large"
              onClick={handleAccept}
            />
          </>
        )}
        {inviteStatus === 'accepted' && (
          <View style={{ width: '100%', textAlign: 'center' }}>
            <Text style={{ fontSize: '32rpx', color: '#00B894', fontWeight: '600' }}>✓ 已接受邀约</Text>
            <Text style={{ fontSize: '24rpx', color: '#636E72', marginTop: '16rpx' }}>正在跳转到行程中...</Text>
          </View>
        )}
        {inviteStatus === 'rejected' && (
          <View style={{ width: '100%', textAlign: 'center' }}>
            <Text style={{ fontSize: '32rpx', color: '#E17055', fontWeight: '600' }}>✕ 已拒绝</Text>
            <Text style={{ fontSize: '24rpx', color: '#636E72', marginTop: '16rpx' }}>正在返回...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default InvitePage;
