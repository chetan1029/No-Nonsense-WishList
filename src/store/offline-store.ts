import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import {produce} from 'immer'; // Import produce from immer
import { SettingsType } from './types';
import {getLocales} from 'react-native-localize';
import {Appearance} from 'react-native';
import { COLORSCHEME } from '../theme/theme';

// Get device language
const myLanguage = getLocales()[0].languageCode;
const languangeOptions = ["en", "ru", "sv"]

const defaultLanguage = languangeOptions.includes(myLanguage) ? myLanguage : "en";

// Get device theme mode
const colorScheme = Appearance.getColorScheme();

interface OfflineStoreState {
  Settings: SettingsType;
  updateSettings: (settings: SettingsType) => Promise<void>;
  themeColor: any;
}

export const useOfflineStore = create<OfflineStoreState>(
  persist(
    (set) => ({
      themeColor: colorScheme == "dark" ? COLORSCHEME.dark : COLORSCHEME.light,
      Settings: { themeMode: colorScheme, language: defaultLanguage },
      updateSettings: async (settings: SettingsType) => {
        set(produce((state) => {
          state.Settings = { ...settings }; // Update settings immutably
        }));
        set(produce((state) =>{
          state.themeColor = settings.themeMode == "dark" ? COLORSCHEME.dark : COLORSCHEME.light; // Update theme color immutably
        }))
      },
    }),
    {
      name: 'wishlist-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
