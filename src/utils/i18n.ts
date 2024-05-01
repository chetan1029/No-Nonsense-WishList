import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';

const myLanguage = getLocales()[0].languageCode;

const resources = {
  en: {
    translation: {
      wishlists: 'Wishlists',
      purchase: 'Purchase',
      friends: 'Friends',
      settings: 'Settings',
    },
  },
  ru: {
    translation: {
      wishlists: 'Список',
      purchase: 'Покупка',
      friends: 'Друзья',
      settings: 'Настройки',
    },
  },
  sv: {
    translation: {
      wishlists: 'Önskelistor',
      purchase: 'Inköp',
      friends: 'Vänner',
      settings: 'inställningar',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    lng: myLanguage,
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;