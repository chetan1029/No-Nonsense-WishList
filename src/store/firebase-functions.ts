import db from '../utils/db';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore/lite";

const fetchCategoryListFromFirebase = async() => {
    const categoryCollection = collection(db, "Category");
    const categorySnapshot = await getDocs(categoryCollection);
    
    return categorySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        name: doc.data().name as string,
        index: index as number,
    }));
}

const fetchWishListItemsFromFirebase = async() => {
    const wishListCollection = collection(db, "Wishlist");
    const wishListQuery = query(wishListCollection, orderBy("createDate", "desc"));
    const wishlistSnapshot = await getDocs(wishListQuery);
    
    return wishlistSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        title: doc.data().title as string,
        category: doc.data().category as string,
        price: doc.data().price as number,
        image: doc.data().image as string,
        url: doc.data().url as string,
        purchase: doc.data().purchase as boolean,
        index: index as number,
    }));
}

const updatePurchaseStatusInFirebase = async(id: string, status: boolean) => {
    const WishlistRef = doc(db, "Wishlist", id);

    const updateData = { "purchase": status};
    await updateDoc(WishlistRef, updateData);
}

const deleteWishListInFirebase = async(id: string) => {
    const WishlistRef = doc(db, "Wishlist", id);
    await deleteDoc(WishlistRef);
}

const addWishListInFirebase = async(category: string, url: string, title: string, price: string) => {
    const wishListCollection = collection(db, "Wishlist");
    await addDoc(
        wishListCollection,
        {
            "category": category, 
            "url": url,
            "title": title, 
            "price": price, 
            "purchase": false, 
            "image": "https://picsum.photos/seed/picsum/200",
            "createDate": serverTimestamp()
        },
        )
}

export {fetchCategoryListFromFirebase, fetchWishListItemsFromFirebase, updatePurchaseStatusInFirebase, deleteWishListInFirebase, addWishListInFirebase}