import Toast from 'react-native-toast-message';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { Linking } from 'react-native';
import {remoteConfig} from './remoteConfig';

const amazonDealLink = "https://amzn.to/4cXPRNd"

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

const fetchKeywords = async () => {
  try {
    await remoteConfig().fetchAndActivate();
    const keywordsString = remoteConfig().getValue('ai_keywords').asString();
    // Check if the fetched string is valid JSON
    const keywords = keywordsString ? JSON.parse(keywordsString) : [];
    return Array.isArray(keywords["keywords"]) ? keywords["keywords"] : [];
  } catch (error) {
    console.error('Error fetching remote config:', error);
    return [];
  }
};

const filterAiPrompt = async(prompt: string) => {
  try {
  // Convert the prompt to lowercase to ensure case-insensitive matching
  const lowerCasePrompt = prompt.toLowerCase();
  const keywords = await fetchKeywords();

  // Check if any keyword is present in the prompt
  const matchedKeywords = keywords.filter((keyword: string) => lowerCasePrompt.includes(keyword.toLowerCase()));

  // Return the result
  return matchedKeywords.length > 0
  } catch (error) {
    console.error('Error in filterAiPrompt:', error);
    return false;
  }
};

export {getCategories, getWishListByCategory, showToast, filterUrl, getTitleFromText, isConnectedToNetwork, openLink, filterAiPrompt, amazonDealLink};