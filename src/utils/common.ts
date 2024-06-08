import Toast from 'react-native-toast-message';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { Linking } from 'react-native';

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
    const filterUrlRegex = /[^a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=]/g;
    return urls[0].replace(filterUrlRegex, '');
  }else{
    return "";
  }
}

const getTitleFromText = (text: string) => {
  const title = text.replace(/https?:\/\/[^\s]+/g, '');
  return title
}

const isConnectedToNetwork = async () => {
  try {
    const state = await NetInfo.fetch();
    if (state.isConnected !== null && state.isConnected !== undefined) {
      return state.isConnected;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking network connection:", error);
    return false;
  }
};

const openLink = async (url: string) => {
  if (url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          // Open the URL in the browser
          Linking.openURL(url);
        } else {
          console.error("Don't know how to open URI: " + url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  }
};

export {getCategories, getWishListByCategory, showToast, filterUrl, getTitleFromText, isConnectedToNetwork, openLink};