import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import en from './languages/english';
import ru from './languages/russian';
import sv from './languages/swedish';

const myLanguage = getLocales()[0].languageCode;

const resources = {
  en: en,
  ru: ru,
  sv: sv,
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