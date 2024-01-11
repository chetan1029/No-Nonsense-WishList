import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WishListData from '../data/WishListData';
import CategoryData from '../data/CategoryData';


export const useStore = create(
  persist(
    (set) => ({
      WishListItems: WishListData,
      CategoryList: CategoryData,
      PurchaseListitems: [],
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