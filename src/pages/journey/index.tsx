import React, { useState, useEffect } from 'react';
import { View, Text, Image, Textarea, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ActionButton from '@/components/ActionButton';
import ActionButtonGroup from '@/components/ActionButtonGroup';
import { mockJourneys, journeyActions } from '@/data/mockJourneys';
import { Journey } from '@/types/journey';
import { storage } from '@/utils/storage';

interface TimelineEvent {
  time: string;
  type: 'note' | 'location_on' | 'location_off' | 'photo' | 'end' | 'extend' | 'confirm';
  content: string;
  icon: string;
}

const JourneyPage: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [note, setNote] = useState('');
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [locationStartTime, setLocationStartTime] = useState<string>('');
  const [distance, setDistance] = useState<number>(500);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const savedJourneys = storage.getJourneys();
    if (savedJourneys.length > 0) {
      setJourneys(savedJourneys);
      const activeJourney = savedJourneys.find(j => 
        j.status === 'ongoing' || j.status === 'confirmed' || j.status === 'completed'
      );
      setCurrentJourney(activeJourney || null);
    } else {
      setJourneys(mockJourneys);
      const activeJourney = mockJourneys.find(j => 
        j.status === 'ongoing' || j.status === 'confirmed'
      );
      setCurrentJourney(activeJourney || null);
    }
  }, []);

  const statusMap = {
    confirmed: '待确认',
    arrived: '已到达',
    ongoing: '进行中',
    paused: '已暂停',
    completed: '已完成'
  };

  const getTimelineEvents = (): TimelineEvent[] => {
    if (!currentJourney) return [];
    
    const events: TimelineEvent[] = [];
    const now = new Date();
    
    if (currentJourney.status === 'confirmed') {
      events.push({
        time: currentJourney.requestInfo.timeSlot.startTime,
        type: 'confirm',
        content: '行程已确认，等待出发前确认',
        icon: '✅'
      });
    }
    
    if (currentJourney.status === 'ongoing' || currentJourney.status === 'completed') {
      events.push({
        time: currentJourney.startTime ? new Date(currentJourney.startTime).toLocaleTimeString() : now.toLocaleTimeString(),
        type: 'confirm',
        content: '确认出发，行程开始',
        icon: '🚀'
      });
    }
    
    currentJourney.notes.forEach(note => {
      let icon = '📝';
      let type: TimelineEvent['type'] = 'note';
      
      if (note.includes('开启了位置共享')) {
        icon = '📍';
        type = 'location_on';
      } else if (note.includes('关闭了位置共享')) {
        icon = '🔒';
        type = 'location_off';
      } else if (note.includes('拍摄了一张照片')) {
        icon = '📷';
        type = 'photo';
      } else if (note.includes('提前结束')) {
        icon = '🏁';
        type = 'end';
      } else if (note.includes('申请延长')) {
        icon = '⏰';
        type = 'extend';
      }
      
      const timeMatch = note.match(/\[(.*?)\]/);
      events.push({
        time: timeMatch ? timeMatch[1] : now.toLocaleTimeString(),
        type,
        content: note,
        icon
      });
    });
    
    if (currentJourney.status === 'completed') {
      events.push({
        time: currentJourney.endTime ? new Date(currentJourney.endTime).toLocaleTimeString() : now.toLocaleTimeString(),
        type: 'end',
        content: '行程已结束',
        icon: '🏁'
      });
    }
    
    return events.sort((a, b) => {
      const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
      const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  };

  const handleConfirmStart = () => {
    if (!currentJourney) return;
    
    const now = new Date().toISOString();
    const updatedJourney = { 
      ...currentJourney, 
      status: 'ongoing' as const,
      startTime: now
    };
    setCurrentJourney(updatedJourney);
    
    const updatedJourneys = journeys.map(j => 
      j.id === currentJourney.id ? updatedJourney : j
    );
    setJourneys(updatedJourneys);
    storage.saveJourneys(updatedJourneys);
    
    setShowConfirmModal(false);
    
    Taro.showToast({
      title: '行程已开始',
      icon: 'success'
    });
  };

  const handleAction = (actionId: string) => {
    if (!currentJourney) return;

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
        if (isLocationSharing) {
          const endTime = new Date().toLocaleTimeString();
          setIsLocationSharing(false);
          const noteRecord = `[${endTime}] 🔒 关闭了位置共享`;
          saveNoteToJourney(noteRecord);
          Taro.showToast({
            title: '定位已关闭',
            icon: 'success'
          });
        } else {
          const startTime = new Date().toLocaleTimeString();
          setLocationStartTime(startTime);
          setIsLocationSharing(true);
          setDistance(Math.floor(Math.random() * 1000) + 200);
          const noteRecord = `[${startTime}] 📍 开启了位置共享给 ${currentJourney.partnerInfo.name}`;
          saveNoteToJourney(noteRecord);
          Taro.showToast({
            title: '定位已开启',
            icon: 'success'
          });
        }
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
          title: '提前结束行程',
          editable: true,
          placeholderText: '请输入提前结束的原因（选填）',
          success: (res) => {
            if (res.confirm) {
              const endTime = new Date().toLocaleTimeString();
              let endNote = `[${endTime}] 🏁 提前结束了行程`;
              if (res.content) {
                endNote += `，原因：${res.content}`;
              }
              
              saveNoteToJourney(endNote);
              
              const now = new Date().toISOString();
              const updatedJourney = { 
                ...currentJourney, 
                status: 'completed' as const,
                endTime: now
              };
              setCurrentJourney(updatedJourney);
              
              const updatedJourneys = journeys.map(j => 
                j.id === currentJourney.id ? updatedJourney : j
              );
              setJourneys(updatedJourneys);
              storage.saveJourneys(updatedJourneys);

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
          editable: true,
          placeholderText: '请输入申请延长的原因（选填）',
          success: (res) => {
            if (res.confirm) {
              const extendTime = new Date().toLocaleTimeString();
              let extendNote = `[${extendTime}] ⏰ 申请延长30分钟`;
              if (res.content) {
                extendNote += `，原因：${res.content}`;
              }
              
              saveNoteToJourney(extendNote);
              
              Taro.showToast({
                title: '已发送申请',
                icon: 'success'
              });
            }
          }
        });
        break;
      case 'note':
        if (note.trim()) {
          const noteTime = new Date().toLocaleTimeString();
          const noteRecord = `[${noteTime}] 📝 ${note.trim()}`;
          saveNoteToJourney(noteRecord);
          Taro.showToast({
            title: '笔记已添加',
            icon: 'success'
          });
          setNote('');
        } else {
          Taro.showToast({
            title: '请输入笔记内容',
            icon: 'none'
          });
        }
        break;
      case 'photo':
        Taro.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            const photoTime = new Date().toLocaleTimeString();
            const photoRecord = `[${photoTime}] 📷 拍摄了一张照片`;
            saveNoteToJourney(photoRecord);
            
            const updatedPhotos = [...currentJourney.photos, tempFilePath];
            const updatedJourney = { ...currentJourney, photos: updatedPhotos };
            setCurrentJourney(updatedJourney);
            
            const updatedJourneys = journeys.map(j => 
              j.id === currentJourney.id ? updatedJourney : j
            );
            setJourneys(updatedJourneys);
            storage.saveJourneys(updatedJourneys);
            
            Taro.showToast({
              title: '照片已保存',
              icon: 'success'
            });
          }
        });
        break;
    }
  };

  const saveNoteToJourney = (noteRecord: string) => {
    if (!currentJourney) return;
    
    const updatedNotes = [...currentJourney.notes, noteRecord];
    const updatedJourney = { ...currentJourney, notes: updatedNotes };
    setCurrentJourney(updatedJourney);
    
    const updatedJourneys = journeys.map(j => 
      j.id === currentJourney.id ? updatedJourney : j
    );
    setJourneys(updatedJourneys);
    storage.saveJourneys(updatedJourneys);
  };

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setShowPhotoViewer(true);
  };

  const handleDeletePhoto = (index: number) => {
    if (!currentJourney) return;
    
    Taro.showModal({
      title: '删除照片',
      content: '确定要删除这张照片吗？',
      success: (res) => {
        if (res.confirm) {
          const updatedPhotos = currentJourney.photos.filter((_, i) => i !== index);
          const updatedJourney = { ...currentJourney, photos: updatedPhotos };
          setCurrentJourney(updatedJourney);
          
          const updatedJourneys = journeys.map(j => 
            j.id === currentJourney.id ? updatedJourney : j
          );
          setJourneys(updatedJourneys);
          storage.saveJourneys(updatedJourneys);
          
          Taro.showToast({
            title: '照片已删除',
            icon: 'success'
          });
          
          if (updatedPhotos.length === 0) {
            setShowPhotoViewer(false);
          } else if (currentPhotoIndex >= updatedPhotos.length) {
            setCurrentPhotoIndex(updatedPhotos.length - 1);
          }
        }
      }
    });
  };

  const handlePreviewPhoto = (photoUrl: string) => {
    Taro.previewImage({
      urls: currentJourney?.photos || [],
      current: photoUrl
    });
  };

  const handleCall = () => {
    if (!currentJourney) return;
    Taro.makePhoneCall({
      phoneNumber: currentJourney.partnerInfo.phone || ''
    });
  };

  const handleEvaluate = () => {
    if (!currentJourney) return;
    
    Taro.showModal({
      title: '评价',
      editable: true,
      placeholderText: '请输入您的评价...',
      success: (res) => {
        if (res.confirm && res.content) {
          const newRecord: import('@/types/records').Record = {
            id: `record_${Date.now()}`,
            type: 'journey',
            date: new Date().toISOString().split('T')[0],
            partnerName: currentJourney.partnerInfo.name,
            partnerAvatar: currentJourney.partnerInfo.avatar,
            activity: currentJourney.requestInfo.title,
            duration: '1小时',
            rating: 5.0,
            status: 'completed',
            evaluation: {
              rating: 5.0,
              comment: res.content,
              tags: ['准时', '友好']
            }
          };
          
          storage.addRecord(newRecord);
          
          const completedJourney = { ...currentJourney, status: 'completed' as const };
          const updatedJourneys = journeys.map(j => 
            j.id === currentJourney.id ? completedJourney : j
          );
          setJourneys(updatedJourneys);
          storage.saveJourneys(updatedJourneys);
          
          Taro.showToast({
            title: '评价成功',
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

  const getLocationDuration = () => {
    if (!locationStartTime || !isLocationSharing) return '';
    const start = new Date(`2000/01/01 ${locationStartTime}`);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff}分钟`;
    return `${Math.floor(diff / 60)}小时${diff % 60}分钟`;
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

  const timelineEvents = getTimelineEvents();

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
            <View className={styles.callButton} onClick={handleCall}>
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

        {currentJourney.status === 'confirmed' && (
          <View className={styles.confirmSection}>
            <ActionButton
              text="出发前确认"
              type="primary"
              size="large"
              fullWidth
              onClick={() => setShowConfirmModal(true)}
            />
          </View>
        )}

        {isLocationSharing && currentJourney.status === 'ongoing' && (
          <View className={styles.locationCard}>
            <View className={styles.locationHeader}>
              <View>
                <Text className={styles.locationTitle}>📍 位置共享中</Text>
                <Text className={styles.locationDuration}>已共享 {getLocationDuration()}</Text>
              </View>
              <Text 
                className={styles.locationClose}
                onClick={() => handleAction('location')}
              >
                关闭
              </Text>
            </View>
            <View className={styles.locationInfo}>
              <Text className={styles.locationPartner}>共享给：{currentJourney.partnerInfo.name}</Text>
            </View>
            <View className={styles.distanceInfo}>
              <Text className={styles.distanceText}>
                距离集合点约 {distance} 米
              </Text>
              <View className={styles.distanceBar}>
                <View 
                  className={styles.distanceProgress} 
                  style={{ width: `${Math.max(10, Math.min(100, 100 - distance / 10))}%` }}
                />
              </View>
            </View>
          </View>
        )}

        <View className={styles.actionSection}>
          <Text className={styles.sectionTitle}>行程操作</Text>
          <ActionButtonGroup 
            actions={journeyActions} 
            onAction={handleAction} 
          />
        </View>

        <View className={styles.noteSection}>
          <Text className={styles.noteTitle}>📜 行程时间线</Text>
          {timelineEvents.length > 0 ? (
            <View className={styles.timeline}>
              {timelineEvents.map((event, index) => (
                <View key={index} className={styles.timelineItem}>
                  <View className={styles.timelineDot}>
                    <Text className={styles.timelineIcon}>{event.icon}</Text>
                  </View>
                  <View className={styles.timelineContent}>
                    <Text className={styles.timelineTime}>{event.time}</Text>
                    <Text className={styles.timelineText}>{event.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className={styles.emptyText}>暂无时间线记录</Text>
          )}
          
          {currentJourney.status !== 'completed' && (
            <>
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
            </>
          )}
        </View>

        <View className={styles.noteSection}>
          <View className={styles.photoHeader}>
            <Text className={styles.noteTitle}>📷 行程照片 ({currentJourney.photos.length})</Text>
            {currentJourney.photos.length > 0 && (
              <Text 
                className={styles.viewAllText}
                onClick={() => {
                  setCurrentPhotoIndex(0);
                  setShowPhotoViewer(true);
                }}
              >
                查看全部
              </Text>
            )}
          </View>
          {currentJourney.photos.length > 0 ? (
            <View className={styles.photoGrid}>
              {currentJourney.photos.map((photo, index) => (
                <View 
                  key={index} 
                  className={styles.photoItem}
                  onClick={() => handlePhotoClick(index)}
                >
                  <Image src={photo} className={styles.photo} mode="aspectFill" />
                  <View className={styles.photoOverlay}>
                    <Text className={styles.photoIcon}>🔍</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className={styles.emptyText}>暂无照片</Text>
          )}
        </View>

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

      {showConfirmModal && (
        <>
          <View className={styles.overlay} onClick={() => setShowConfirmModal(false)} />
          <View className={styles.confirmModal}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>出发前确认</Text>
              <Text className={styles.modalClose} onClick={() => setShowConfirmModal(false)}>✕</Text>
            </View>
            
            <View className={styles.modalContent}>
              <View className={styles.confirmItem}>
                <Text className={styles.confirmLabel}>👤 对方信息</Text>
                <View className={styles.confirmValue}>
                  <Image src={currentJourney.partnerInfo.avatar} className={styles.confirmAvatar} mode="aspectFill" />
                  <View>
                    <Text className={styles.confirmName}>{currentJourney.partnerInfo.name}</Text>
                    <Text className={styles.confirmMeta}>⭐ {currentJourney.partnerInfo.rating} · 已认证</Text>
                  </View>
                </View>
              </View>

              <View className={styles.confirmItem}>
                <Text className={styles.confirmLabel}>📍 集合地点</Text>
                <Text className={styles.confirmText}>{currentJourney.requestInfo.location.name}</Text>
                <Text className={styles.confirmSubtext}>{currentJourney.requestInfo.location.address}</Text>
              </View>

              <View className={styles.confirmItem}>
                <Text className={styles.confirmLabel}>🤫 约定暗号</Text>
                <View className={styles.secretDisplay}>
                  <Text className={styles.secretText}>{currentJourney.secretCode}</Text>
                </View>
              </View>

              <View className={styles.confirmItem}>
                <Text className={styles.confirmLabel}>📅 约定时间</Text>
                <Text className={styles.confirmText}>
                  {currentJourney.requestInfo.timeSlot.date} {currentJourney.requestInfo.timeSlot.startTime}
                </Text>
              </View>

              <View className={styles.callConfirmButton} onClick={handleCall}>
                <Text className={styles.callConfirmIcon}>📞</Text>
                <Text className={styles.callConfirmText}>一键拨号确认</Text>
              </View>
            </View>

            <View className={styles.modalFooter}>
              <ActionButton
                text="取消"
                type="secondary"
                size="large"
                onClick={() => setShowConfirmModal(false)}
              />
              <ActionButton
                text="确认出发"
                type="primary"
                size="large"
                onClick={handleConfirmStart}
              />
            </View>
          </View>
        </>
      )}

      {showPhotoViewer && currentJourney.photos.length > 0 && (
        <>
          <View className={styles.photoViewerOverlay} onClick={() => setShowPhotoViewer(false)}>
            <View className={styles.photoViewerHeader}>
              <Text className={styles.photoViewerTitle}>
                {currentPhotoIndex + 1} / {currentJourney.photos.length}
              </Text>
              <Text 
                className={styles.photoViewerClose}
                onClick={() => setShowPhotoViewer(false)}
              >
                ✕
              </Text>
            </View>
            <Swiper
              className={styles.photoSwiper}
              current={currentPhotoIndex}
              onChange={(e) => setCurrentPhotoIndex(e.detail.current)}
              circular
            >
              {currentJourney.photos.map((photo, index) => (
                <SwiperItem key={index}>
                  <Image 
                    src={photo} 
                    className={styles.photoViewerImage}
                    mode="aspectFit"
                    onClick={() => handlePreviewPhoto(photo)}
                  />
                </SwiperItem>
              ))}
            </Swiper>
            <View className={styles.photoViewerFooter}>
              <View 
                className={styles.deletePhotoButton}
                onClick={() => handleDeletePhoto(currentPhotoIndex)}
              >
                <Text className={styles.deletePhotoIcon}>🗑️</Text>
                <Text className={styles.deletePhotoText}>删除</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default JourneyPage;
