import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WishListData from '../data/WishListData';
import db from '../utils/db';
import { collection, getDocs } from "firebase/firestore/lite";

export const useStore = create(
  persist(
    (set) => ({
      CategoryList: [],
      WishListItems: [],
      PurchaseListitems: [],
      fetchCategoryList: async () => {
       try {
        const categoryCollection = collection(db, "Category");
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          name: doc.data().name as string,
          index: index as number,
        }));
        set({CategoryList: categoryList});
       } catch (error) {
        console.error("Error fetching data", error);
       }
      }, 
      fetchWishListItems: async () => {
        try {
         const wishListCollection = collection(db, "Wishlist");
         const wishlistSnapshot = await getDocs(wishListCollection);
         const wishList = wishlistSnapshot.docs.map((doc, index) => ({
           id: doc.id,
           title: doc.data().title as string,
           category: doc.data().category as string,
           price: doc.data().price as number,
           image: doc.data().image as string,
           url: doc.data().url as string,
           purchase: doc.data().purchase as boolean,
           index: index as number,
         }));
         set({WishListItems: wishList});
        } catch (error) {
         console.error("Error fetching data", error);
        }
       }, 
      addToPurchaseList: (id: string) =>
        set(
          produce(state => {
              for (let i = 0; i < state.WishListItems.length; i++) {
                if (state.WishListItems[i].id == id) {
                  if (state.WishListItems[i].purchase == false) {
                    state.WishListItems[i].purchase = true;
                    state.PurchaseListitems.unshift(state.WishListItems[i]);
                  } else {
                    state.WishListItems[i].purchase = false;
                  }
                  break;
                }
              }
          }),
        ),
      deleteFromPurchaseList: (id: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.WishListItems.length; i++) {
              if (state.WishListItems[i].id == id) {
                if (state.WishListItems[i].purchase == true) {
                  state.WishListItems[i].purchase = false;
                } else {
                  state.WishListItems[i].purchase = true;
                }
                break;
              }
            }
            let spliceIndex = -1;
            for (let i = 0; i < state.PurchaseListitems.length; i++) {
              if (state.PurchaseListitems[i].id == id) {
                spliceIndex = i;
                break;
              }
            }
            state.PurchaseListitems.splice(spliceIndex, 1);
          }),
        ),
      deleteFromWishList: (id: string) =>
        set(
          produce((state) => {
            const index = state.WishListItems.findIndex((item: { id: string; }) => item.id === id);
            if (index !== -1) {
              state.WishListItems.splice(index, 1);
            }
          })
      ),
    }),
    {
      name: 'coffee-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);