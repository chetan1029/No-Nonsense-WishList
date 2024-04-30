import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import {produce} from 'immer'; // Import produce from immer
import { SettingsType } from './types';

interface OfflineStoreState {
  Settings: SettingsType;
  updateSettings: (settings: SettingsType) => Promise<void>;
}

export const useOfflineStore = create<OfflineStoreState>(
  persist(
    (set) => ({
      Settings: { themeMode: "Automatic", language: "English" },
      updateSettings: async (settings: SettingsType) => {
        set(produce((state) => {
          state.Settings = { ...settings }; // Update settings immutably
        }));
      },
    }),
    {
      name: 'wishlist-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
