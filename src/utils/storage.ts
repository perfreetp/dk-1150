import Taro from '@tarojs/taro';
import { WeekendRequest } from '@/types/weekend';
import { MatchRequest } from '@/types/match';
import { Journey } from '@/types/journey';
import { Record } from '@/types/records';

const STORAGE_KEYS = {
  MY_REQUESTS: 'my_requests',
  MATCH_REQUESTS: 'match_requests',
  JOURNEYS: 'journeys',
  RECORDS: 'records',
  CURRENT_JOURNEY: 'current_journey',
  INVITE_STATUS: 'invite_status'
};

export const storage = {
  getMyRequests: (): WeekendRequest[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.MY_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Failed to get my requests:', error);
      return [];
    }
  },

  saveMyRequests: (requests: WeekendRequest[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.MY_REQUESTS, JSON.stringify(requests));
    } catch (error) {
      console.error('[Storage] Failed to save my requests:', error);
    }
  },

  addMyRequest: (request: WeekendRequest): void => {
    const requests = storage.getMyRequests();
    requests.unshift(request);
    storage.saveMyRequests(requests);
  },

  updateMyRequestStatus: (requestId: string, status: WeekendRequest['status'], matchedUser?: WeekendRequest['matchedUser']): void => {
    const requests = storage.getMyRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index].status = status;
      if (matchedUser) {
        requests[index].matchedUser = matchedUser;
      }
      storage.saveMyRequests(requests);
    }
  },

  getMatchRequests: (): (MatchRequest & { status: 'available' | 'accepted' | 'rejected' })[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.MATCH_REQUESTS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Storage] Failed to get match requests:', error);
      return null;
    }
  },

  saveMatchRequests: (requests: (MatchRequest & { status: 'available' | 'accepted' | 'rejected' })[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.MATCH_REQUESTS, JSON.stringify(requests));
    } catch (error) {
      console.error('[Storage] Failed to save match requests:', error);
    }
  },

  updateMatchRequestStatus: (requestId: string, status: 'available' | 'accepted' | 'rejected'): void => {
    let requests = storage.getMatchRequests();
    if (!requests) {
      requests = [];
    }
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index].status = status;
    } else {
      requests.push({ id: requestId, status } as any);
    }
    storage.saveMatchRequests(requests);
  },

  getJourneys: (): Journey[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.JOURNEYS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Failed to get journeys:', error);
      return [];
    }
  },

  saveJourneys: (journeys: Journey[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.JOURNEYS, JSON.stringify(journeys));
    } catch (error) {
      console.error('[Storage] Failed to save journeys:', error);
    }
  },

  addJourney: (journey: Journey): void => {
    const journeys = storage.getJourneys();
    journeys.unshift(journey);
    storage.saveJourneys(journeys);
  },

  updateJourney: (journeyId: string, updates: Partial<Journey>): void => {
    const journeys = storage.getJourneys();
    const index = journeys.findIndex(j => j.id === journeyId);
    if (index !== -1) {
      journeys[index] = { ...journeys[index], ...updates };
      storage.saveJourneys(journeys);
    }
  },

  getCurrentJourney: (): Journey | null => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.CURRENT_JOURNEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Storage] Failed to get current journey:', error);
      return null;
    }
  },

  setCurrentJourney: (journey: Journey | null): void => {
    try {
      if (journey) {
        Taro.setStorageSync(STORAGE_KEYS.CURRENT_JOURNEY, JSON.stringify(journey));
      } else {
        Taro.removeStorageSync(STORAGE_KEYS.CURRENT_JOURNEY);
      }
    } catch (error) {
      console.error('[Storage] Failed to set current journey:', error);
    }
  },

  getRecords: (): Record[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Failed to get records:', error);
      return [];
    }
  },

  saveRecords: (records: Record[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('[Storage] Failed to save records:', error);
    }
  },

  addRecord: (record: Record): void => {
    const records = storage.getRecords();
    records.unshift(record);
    storage.saveRecords(records);
  },

  getInviteStatus: (inviteId: string): 'pending' | 'accepted' | 'rejected' | null => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.INVITE_STATUS);
      const statuses = data ? JSON.parse(data) : {};
      return statuses[inviteId] || null;
    } catch (error) {
      console.error('[Storage] Failed to get invite status:', error);
      return null;
    }
  },

  setInviteStatus: (inviteId: string, status: 'pending' | 'accepted' | 'rejected'): void => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.INVITE_STATUS);
      const statuses = data ? JSON.parse(data) : {};
      statuses[inviteId] = status;
      Taro.setStorageSync(STORAGE_KEYS.INVITE_STATUS, JSON.stringify(statuses));
    } catch (error) {
      console.error('[Storage] Failed to set invite status:', error);
    }
  }
};

export default storage;
