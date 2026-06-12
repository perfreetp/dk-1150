import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import MatchCard from '@/components/MatchCard';
import { mockMatchRequests } from '@/data/mockMatchRequests';
import { MatchRequest } from '@/types/match';

const MatchPage: React.FC = () => {
  const [requests] = useState<MatchRequest[]>(mockMatchRequests);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: '全部' },
    { value: 'exhibition', label: '陪看展' },
    { value: 'park', label: '公园慢走' },
    { value: 'shopping', label: '商场试衣' },
    { value: 'pet', label: '宠物陪遛' },
    { value: 'other', label: '其他' }
  ];

  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter(req => req.type === activeFilter);

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
        <Text className={styles.title}>快速匹配</Text>
        <Text className={styles.subtitle}>发现附近的陪伴需求</Text>
      </View>

      <ScrollView scrollX className={styles.filterBar}>
        {filterOptions.map(option => (
          <View
            key={option.value}
            className={`${styles.filterTag} ${activeFilter === option.value ? styles.activeFilter : ''}`}
            onClick={() => setActiveFilter(option.value)}
          >
            <Text>{option.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView scrollY className={styles.content} onScrollToLower={() => {}}>
        <View className={styles.sectionTitle}>
          <Text>可匹配的请求 ({filteredRequests.length})</Text>
        </View>

        {filteredRequests.length > 0 ? (
          <View className={styles.requestList}>
            {filteredRequests.map(request => (
              <MatchCard key={request.id} request={request} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>暂无匹配的请求</Text>
            <Text className={styles.emptyText}>换个筛选条件试试吧</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MatchPage;
