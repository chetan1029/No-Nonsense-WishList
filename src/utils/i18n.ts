import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import en from './languages/english';
import ru from './languages/russian';
import sv from './languages/swedish';
import es from './languages/spanish';
import zh from './languages/chinese';
import fr from './languages/french';
import de from './languages/german';

const myLanguage = getLocales()[0].languageCode;

const resources = {
  en: en,
  ru: ru,
  sv: sv,
  es: es,
  zh: zh,
  fr: fr,
  de: de,
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