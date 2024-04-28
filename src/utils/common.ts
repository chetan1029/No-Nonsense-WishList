import Toast from 'react-native-toast-message';
import axios from 'axios';

const getCategories = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return [...new Set(data.map(item => item.category))];
  };
  
const getWishListByCategory = (category: string, data: any[], purchase: boolean) => {
  if(category){
    return data.filter(item => item.category === category && item.purchase == purchase);
  }else{
    return data.filter(item => item.purchase == purchase);
  }
};

const showToast = (message: string, type: string) => {
  Toast.show({
    type: type,
    text1: message,
    visibilityTime: 1000,
    position: 'bottom',
  });
};

const filterUrl = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  if(urls && urls.length > 0){
    return urls[0];
  }else{
    return "";
  }
}

const getTitleFromText = (text: string) => {
  const title = text.replace(/https?:\/\/[^\s]+/g, '');
  return title
}

export {getCategories, getWishListByCategory, showToast, filterUrl, getTitleFromText};