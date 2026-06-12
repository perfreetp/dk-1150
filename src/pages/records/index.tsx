import React, { useState } from 'react';
import { View, Text, Image, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RecordCard from '@/components/RecordCard';
import ActionButton from '@/components/ActionButton';
import { mockRecords, mockReviews, mockUserStats, privacyOptions } from '@/data/mockRecords';
import { Record } from '@/types/records';

const RecordsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'reviews'>('records');
  const [privacySettings, setPrivacySettings] = useState(privacyOptions);

  const completedRecords = mockRecords.filter(r => r.status === 'completed');

  const handlePrivacyChange = (id: string, value: boolean) => {
    setPrivacySettings(settings =>
      settings.map(s => s.id === id ? { ...s, checked: value } : s)
    );
    Taro.showToast({
      title: '设置已更新',
      icon: 'success'
    });
  };

  const handleReport = () => {
    Taro.showModal({
      title: '异常举报',
      content: '请详细描述您遇到的问题，我们会尽快处理',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '举报已提交',
            icon: 'success'
          });
        }
      }
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
        <Text className={styles.title}>个人记录</Text>

        <View className={styles.statsCard}>
          <Text className={styles.statsTitle}>我的陪伴数据</Text>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{mockUserStats.totalHours}</Text>
              <Text className={styles.statLabel}>陪伴时长(h)</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{mockUserStats.totalTimes}</Text>
              <Text className={styles.statLabel}>陪伴次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{mockUserStats.averageRating}</Text>
              <Text className={styles.statLabel}>平均评分</Text>
            </View>
          </View>
          <View className={styles.tagsSection}>
            <Text className={styles.tagsLabel}>我的标签</Text>
            <View className={styles.tagsList}>
              {mockUserStats.tags.map((tag, index) => (
                <View key={index} className={styles.tag}>
                  <Text className={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={`${styles.tab} ${activeTab === 'records' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('records')}
        >
          <Text>行程记录</Text>
        </View>
        <View
          className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <Text>评价记录</Text>
        </View>
      </View>

      <View className={styles.content}>
        {activeTab === 'records' ? (
          <>
            <Text className={styles.sectionTitle}>已完成行程</Text>
            {completedRecords.length > 0 ? (
              <View className={styles.recordList}>
                {completedRecords.map(record => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📝</Text>
                <Text className={styles.emptyText}>暂无完成的行程</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text className={styles.sectionTitle}>收到的评价</Text>
            {mockReviews.length > 0 ? (
              <View className={styles.recordList}>
                {mockReviews.map(review => (
                  <View key={review.id} className={styles.reviewItem}>
                    <View className={styles.reviewHeader}>
                      <Image
                        src={review.avatar}
                        className={styles.avatar}
                        mode="aspectFill"
                      />
                      <View className={styles.reviewInfo}>
                        <Text className={styles.reviewerName}>{review.from}</Text>
                        <Text className={styles.reviewDate}>{review.date}</Text>
                      </View>
                      <Text className={styles.reviewRating}>⭐ {review.rating}</Text>
                    </View>
                    <View className={styles.reviewContent}>
                      <Text className={styles.reviewText}>{review.comment}</Text>
                    </View>
                    <View className={styles.reviewTags}>
                      {review.tags.map((tag, index) => (
                        <View key={index} className={styles.reviewTag}>
                          <Text className={styles.reviewTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>⭐</Text>
                <Text className={styles.emptyText}>暂无评价</Text>
              </View>
            )}
          </>
        )}

        <View className={styles.settingSection}>
          <Text className={styles.sectionTitle}>隐私与安全</Text>
          {privacySettings.map(setting => (
            <View key={setting.id} className={styles.settingItem}>
              <View className={styles.settingInfo}>
                <Text className={styles.settingLabel}>{setting.label}</Text>
                <Text className={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                checked={setting.checked}
                onChange={(e) => handlePrivacyChange(setting.id, e.detail.value)}
                color="#FF6B6B"
              />
            </View>
          ))}

          <View className={styles.actionButton}>
            <ActionButton
              text="异常举报"
              type="danger"
              size="large"
              fullWidth
              onClick={handleReport}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecordsPage;
