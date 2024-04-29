import db from '../utils/db';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, serverTimestamp, query, orderBy, where } from "firebase/firestore/lite";
import firestore from '@react-native-firebase/firestore';
import { WishListItem } from './types';

const fetchWishListItemsFromFirebase = async(userId: string) => {
    let wishlistItems: WishListItem[] = [];
    await firestore().collection('Wishlist').where("userId", "==" , userId).orderBy('createDate', 'desc').get().then((wishlistSnapshot) => {
        if (!wishlistSnapshot.empty) {
            wishlistItems = wishlistSnapshot.docs.map((doc) => ({
                id: doc.id,
                category: doc.data().category,
                url: doc.data().url,
                title: doc.data().title,
                price: doc.data().price,
                image: doc.data().image,
                createdDate: doc.data().createdDate,
                purchase: doc.data().purchase,
            }));
        }
    });
    return wishlistItems;
}

const updatePurchaseStatusInFirebase = async(id: string, status: boolean, userId: string) => {
    await firestore().collection('Wishlist').doc(id).update({ "purchase": status});
}

const deleteWishListInFirebase = async(id: string, userId: string) => {
    await firestore().collection('Wishlist').doc(id).delete();
}

const addWishListInFirebase = async(category: string, url: string, title: string, price: string, thumbnailImage: string, userId: string) => {
    if(!thumbnailImage){
        thumbnailImage = "https://picsum.photos/seed/picsum/200";
    }
    await firestore().collection('Wishlist').add(
        { 
            "category": category, 
            "url": url,
            "title": title, 
            "price": price, 
            "purchase": false, 
            "image": thumbnailImage,
            "createDate": serverTimestamp(),
            "userId": userId,
        }
    )
}

const deleteCategoryInFirebase = async(categoryName: string, userId: string) => {
    const wishListCollection =  await firestore().collection('Wishlist').where("userId", "==", userId).where("category", "==", categoryName).get()

    const batch = firestore().batch();
    wishListCollection.forEach(documentSnapshot => {
        batch.delete(documentSnapshot.ref);
      });
    return batch.commit();
}

const updateCategoryInFirebase = async(oldCategory: string, newCategory: string, userId: string) => {
    const wishListCollection =  await firestore().collection('Wishlist').where("userId", "==", userId).where("category", "==", oldCategory).get()
    
    const batch = firestore().batch();
    wishListCollection.forEach(documentSnapshot => {
        batch.update(documentSnapshot.ref, {"category": newCategory});
      });
    return batch.commit();
}

export { 
    fetchWishListItemsFromFirebase, 
    updatePurchaseStatusInFirebase, 
    deleteWishListInFirebase, 
    addWishListInFirebase, 
    deleteCategoryInFirebase, 
    updateCategoryInFirebase
}