import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RequestCard from '@/components/RequestCard';
import ActionButton from '@/components/ActionButton';
import TagSelector from '@/components/TagSelector';
import { mockWeekendRequests, requestTypeOptions, timeSlotOptions, genderOptions, costOptions } from '@/data/mockWeekendRequests';
import { WeekendRequest, RequestFormData } from '@/types/weekend';

const WeekendPage: React.FC = () => {
  const [requests] = useState<WeekendRequest[]>(mockWeekendRequests);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RequestFormData>({
    type: 'exhibition',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    genderPreference: 'any',
    costType: 'aa',
    chatBoundary: ''
  });

  const handlePublish = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.locationName) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    });
    setShowForm(false);
    setFormData({
      type: 'exhibition',
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      locationName: '',
      locationAddress: '',
      genderPreference: 'any',
      costType: 'aa',
      chatBoundary: ''
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

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>周末一小时</Text>
        <Text className={styles.subtitle}>找到愿意陪伴的你</Text>
      </View>

      <ScrollView
        scrollY
        className={styles.content}
        onScrollToLower={() => {}}
      >
        <View className={styles.sectionTitle}>
          <Text>我的计划</Text>
        </View>

        {requests.length > 0 ? (
          <View className={styles.requestList}>
            {requests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📅</Text>
            <Text className={styles.emptyText}>还没有发布计划</Text>
            <Text className={styles.emptyText}>点击下方按钮发布你的第一个请求</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.publishButton}>
        <ActionButton
          text="发布新请求"
          type="primary"
          size="large"
          fullWidth
          onClick={() => setShowForm(true)}
        />
      </View>

      {showForm && (
        <>
          <View className={styles.overlay} onClick={() => setShowForm(false)} />
          <View className={styles.formContainer}>
            <View
              className={styles.closeButton}
              onClick={() => setShowForm(false)}
            >
              <Text className={styles.closeText}>✕</Text>
            </View>

            <Text className={styles.formTitle}>发布陪伴请求</Text>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>陪伴类型</Text>
              <TagSelector
                options={requestTypeOptions}
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as any })}
                type="card"
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>标题</Text>
              <Input
                className={styles.formInput}
                placeholder="简短描述你的需求"
                value={formData.title}
                onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>详细描述</Text>
              <Textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder="详细描述你想要的陪伴内容"
                value={formData.description}
                onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>日期</Text>
              <Input
                className={styles.formInput}
                type="date"
                placeholder="选择日期"
                value={formData.date}
                onInput={(e) => setFormData({ ...formData, date: e.detail.value })}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>时间段</Text>
              <View className={styles.formRow}>
                <Input
                  className={styles.formInput}
                  type="time"
                  placeholder="开始时间"
                  value={formData.startTime}
                  onInput={(e) => setFormData({ ...formData, startTime: e.detail.value })}
                />
                <Input
                  className={styles.formInput}
                  type="time"
                  placeholder="结束时间"
                  value={formData.endTime}
                  onInput={(e) => setFormData({ ...formData, endTime: e.detail.value })}
                />
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>集合地点</Text>
              <Input
                className={styles.formInput}
                placeholder="地点名称"
                value={formData.locationName}
                onInput={(e) => setFormData({ ...formData, locationName: e.detail.value })}
              />
              <Input
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder="详细地址"
                value={formData.locationAddress}
                onInput={(e) => setFormData({ ...formData, locationAddress: e.detail.value })}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>性别偏好</Text>
              <TagSelector
                options={genderOptions}
                value={formData.genderPreference}
                onChange={(value) => setFormData({ ...formData, genderPreference: value as any })}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>费用方式</Text>
              <TagSelector
                options={costOptions}
                value={formData.costType}
                onChange={(value) => setFormData({ ...formData, costType: value as any })}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>聊天边界</Text>
              <Textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder="设定聊天边界，让对方了解"
                value={formData.chatBoundary}
                onInput={(e) => setFormData({ ...formData, chatBoundary: e.detail.value })}
              />
            </View>

            <View className={styles.formButtonGroup}>
              <ActionButton
                text="取消"
                type="secondary"
                size="large"
                onClick={() => setShowForm(false)}
              />
              <ActionButton
                text="发布"
                type="primary"
                size="large"
                onClick={handlePublish}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default WeekendPage;
