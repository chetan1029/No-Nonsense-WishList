import {create} from 'zustand';
import {produce} from 'immer';
import {
  fetchWishListItemsFromFirebase, 
  updatePurchaseStatusInFirebase, 
  deleteWishListInFirebase, 
  addWishListInFirebase, 
  deleteCategoryInFirebase, 
  updateCategoryInFirebase, 
  fetchCategoryListFromFirebase,
  fetchSharedWishListFromFirebase,
  fetchSharedWishListItemsFromFirebase,
  removeFromSharedWishListInFirebase,
  addToSharedWishListInFirebase
} from "./firebase-functions";
import { AlertMessageDetailItem, CategoryItem, SettingsType, SharedWishListItem, UserType, WishListItem } from './types';
import axios from 'axios';
import { parseHTMLContent } from '../utils/parsehtml';
import { getTitleFromText, isConnectedToNetwork, showToast } from '../utils/common';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface StoreState {
  UserDetail: any;
  CategoryList: CategoryItem[];
  WishListItems: WishListItem[];
  PurchaseListitems: WishListItem[];
  WebPageContent: string;
  Settings: SettingsType;
  SharedWishList: SharedWishListItem[];
  SharedWishListItems: WishListItem[];
  AlertMessageDetails: { title: string, message: string, action: any};
  setUserDetail: (user: any) => void;
  fetchWishListItems: (user: any) => Promise<void>;
  fetchCateogryList: (user: any) => Promise<void>;
  addToPurchaseList: (id: string, user:any) => Promise<void>;
  removeFromPurchaseList: (id: string, user:any) => Promise<void>;
  deleteFromWishList: (id: string, user:any) => Promise<void>;
  addWishList: (category: string, url: string, title: string, price: string, user:any) => Promise<void>;
  fetchWebPageContent: (url: string) => Promise<void>;
  updateSettings: (settings: SettingsType) => Promise<void>;
  fetchSharedWishList: (user: any) => Promise<void>;
  fetchSharedWishListItems: (userId: string, category: string) => Promise<void>;
  removeFromSharedWishList: (user: any, sharedWishListId: string) => Promise<void>;
  addToSharedWishList: (user: any, categoryId: string) => Promise<void>;
}


export const useStore = create<StoreState>(
  (set, get) => ({
      UserDetail: {},
      CategoryList: [],
      WishListItems: [],
      PurchaseListitems: [],
      SharedWishList: [],
      SharedWishListItems: [],
      WebPageContent: '',
      AlertMessageDetails: {title: '', message: '', action: ''},
      Settings: {themeMode: "Automatic", language: "English"},
      setUserDetail: async(user: any) => {
        set({UserDetail: user})
      },
      fetchWishListItems: async (user: any) => {
        try {
         const wishList = await fetchWishListItemsFromFirebase(user.uid);
         set({WishListItems: wishList});
        } catch (error) {
         console.error("Error fetching data", error);
        }
       }, 
      fetchCateogryList: async (user: any) => {
        try {
        const category = await fetchCategoryListFromFirebase(user.uid);
        set({CategoryList: category});
        } catch (error) {
        console.error("Error fetching data", error);
        }
      }, 
      addToPurchaseList: async(id: string, user:any) => {
        try {
          await updatePurchaseStatusInFirebase(id, true, user.uid);
          
          // Fetch updated wishlist items from Firebase
          await get().fetchWishListItems(user);
          await get().fetchCateogryList(user);
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
      removeFromPurchaseList: async(id: string, user:any) => {
        try {
          await updatePurchaseStatusInFirebase(id, false, user.uid);
          
          // Fetch updated wishlist items from Firebase
          await get().fetchWishListItems(user);
          await get().fetchCateogryList(user);
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
      deleteFromWishList: async(id: string, user:any) => {
        try {
        await deleteWishListInFirebase(id, user.uid);
        
        // Fetch updated wishlist items from Firebase
        await get().fetchWishListItems(user);
        await get().fetchCateogryList(user);
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
      addWishList: async(category: string, url: string, rawUrl: string, user:any) => {
        try {
          console.log(isConnectedToNetwork());
          // TODO: test this one live device
          if (!isConnectedToNetwork()) {
            throw new Error("No internet connection");
          }
          const response = await axios.get(url);
          const {title, thumbnailImage, price} = parseHTMLContent(response.data);
          await addWishListInFirebase(category, url, title, price, thumbnailImage, user.uid);
          
          // Fetch updated wishlist items from Firebase
          await get().fetchWishListItems(user);
          await get().fetchCateogryList(user);
        } catch (error: any) {
          if (error.message === "No internet connection") {
            // TODO: we can show a toast message that
            showToast(`No Internet Connection: we will update data once you are back online`, 'info');
            const title = getTitleFromText(rawUrl);
            await addWishListInFirebase(category, url, title, "", "", user.uid);
          }else if (axios.isAxiosError(error)) {
            const title = getTitleFromText(rawUrl);
            await addWishListInFirebase(category, url, title, "", "", user.uid);
          }else {
            console.error("Error Updating data:", error);
          }
        }
      },
      fetchWebPageContent: async(url: string) => {
        try {
          const response = await axios.get(url);
          set({WebPageContent: response.data});
        } catch (error) {
          console.error("Error fetching data", error);
        }
      },
      deleteCategory: async(categoryName: string, user:any) => {
        try {
        await deleteCategoryInFirebase(categoryName, user.uid);
        
        // Fetch updated wishlist items from Firebase
        await get().fetchWishListItems(user);
        await get().fetchCateogryList(user);
        } catch (error) {
        console.error("Error Deleteting category", error);
        }
      },
      updateCategory: async(oldCategory:string, newCategory: string, user:any) => {
        try {
        await updateCategoryInFirebase(oldCategory, newCategory, user.uid);
        
        // Fetch updated wishlist items from Firebase
        await get().fetchWishListItems(user);
        await get().fetchCateogryList(user);
        } catch (error) {
        console.error("Error Deleteting category", error);
        }
      },
      updateSettings: async(settings: SettingsType) => {
        try {
          await AsyncStorage.setItem('settings', JSON.stringify(settings));
          set({ Settings: settings });
        } catch (error) {
          console.error("Error updating settings", error);
        }
      },
      fetchSharedWishList: async (user: any) => {
        try {
         const sharewishList = await fetchSharedWishListFromFirebase(user.uid);
         set({SharedWishList: sharewishList});
        } catch (error) {
         console.error("Error fetching data", error);
        }
       }, 
      fetchSharedWishListItems: async (userId: string, category: string) => {
        try {
          const sharedwishListItems = await fetchSharedWishListItemsFromFirebase(userId, category);
          set({SharedWishListItems: sharedwishListItems});
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }, 
      removeFromSharedWishList: async(user: any, sharedWishListId: string) => {
        try {
        await removeFromSharedWishListInFirebase(sharedWishListId, user.uid);
        
        // Fetch updated SharedWishlist items from Firebase
        await get().fetchSharedWishList(user);
        } catch (error) {
        console.error("Error Deleteting Shared WishList", error);
        }
      },
      addToSharedWishList: async(user: any, categoryId:any) => {
        try {
          const shareWishListMsg = await addToSharedWishListInFirebase(categoryId, user.uid);
          
          set({AlertMessageDetails: shareWishListMsg});
          // Fetch updated SharedWishlist items from Firebase
          await get().fetchSharedWishList(user);
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
    }),
  );