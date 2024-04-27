import {create} from 'zustand';
import {produce} from 'immer';
import {fetchWishListItemsFromFirebase, updatePurchaseStatusInFirebase, deleteWishListInFirebase, addWishListInFirebase, deleteCategoryInFirebase, updateCategoryInFirebase} from "./firebase-functions";
import { CategoryItem, WishListItem } from './types';
import axios from 'axios';
import { parseHTMLContent } from '../utils/parsehtml';
import { getTitleFromText } from '../utils/common';

interface StoreState {
  CategoryList: CategoryItem[];
  WishListItems: WishListItem[];
  PurchaseListitems: WishListItem[];
  WebPageContent: string;
  fetchWishListItems: () => Promise<void>;
  addToPurchaseList: (id: string) => Promise<void>;
  removeFromPurchaseList: (id: string) => Promise<void>;
  deleteFromWishList: (id: string) => Promise<void>;
  addWishList: (category: string, url: string, title: string, price: string) => Promise<void>;
  fetchWebPageContent: (url: string) => Promise<void>;
}


export const useStore = create<StoreState>(
  (set, get) => ({
      CategoryList: [],
      WishListItems: [],
      PurchaseListitems: [],
      WebPageContent: '',
      fetchWishListItems: async () => {
        try {
         const wishList = await fetchWishListItemsFromFirebase();
         set({WishListItems: wishList});
        } catch (error) {
         console.error("Error fetching data", error);
        }
       }, 
      addToPurchaseList: async(id: string) => {
        try {
          await updatePurchaseStatusInFirebase(id, true);
          
          // Fetch updated wishlist items from Firebase
          await get().fetchWishListItems();
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
      removeFromPurchaseList: async(id: string) => {
        try {
          await updatePurchaseStatusInFirebase(id, false);
          
          // Fetch updated wishlist items from Firebase
          await get().fetchWishListItems();
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
      deleteFromWishList: async(id: string) => {
        try {
        await deleteWishListInFirebase(id);
        
        // Fetch updated wishlist items from Firebase
        await get().fetchWishListItems();
        } catch (error) {
        console.error("Error Updating data", error);
        }
      },
      addWishList: async(category: string, url: string, rawUrl: string) => {
        console.log(category, url, rawUrl);
        try {
          const response = await axios.get(url);
          const {title, thumbnailImage, price} = parseHTMLContent(response.data);
          await addWishListInFirebase(category, url, title, price, thumbnailImage);
          
          // Fetch updated wishlist items from Firebase
          await get().fetchWishListItems();
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            const title = getTitleFromText(rawUrl);
            await addWishListInFirebase(category, url, title, "", "");
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
      deleteCategory: async(categoryName: string) => {
        try {
        await deleteCategoryInFirebase(categoryName);
        
        // Fetch updated wishlist items from Firebase
        await get().fetchWishListItems();
        } catch (error) {
        console.error("Error Deleteting category", error);
        }
      },
      updateCategory: async(oldCategory:string, newCategory: string) => {
        try {
        await updateCategoryInFirebase(oldCategory, newCategory);
        
        // Fetch updated wishlist items from Firebase
        await get().fetchWishListItems();
        } catch (error) {
        console.error("Error Deleteting category", error);
        }
      },
    }),
  );