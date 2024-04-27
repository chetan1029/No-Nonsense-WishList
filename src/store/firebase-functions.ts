import db from '../utils/db';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, serverTimestamp, query, orderBy, where } from "firebase/firestore/lite";

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

const addWishListInFirebase = async(category: string, url: string, title: string, price: string, thumbnailImage: string) => {
    const wishListCollection = collection(db, "Wishlist");
    if(!thumbnailImage){
        thumbnailImage = "https://picsum.photos/seed/picsum/200";
    }
    await addDoc(
        wishListCollection,
        {
            "category": category, 
            "url": url,
            "title": title, 
            "price": price, 
            "purchase": false, 
            "image": thumbnailImage,
            "createDate": serverTimestamp()
        },
        )
}

const deleteCategoryInFirebase = async(categoryName: string) => {
    const wishListCollection = collection(db, "Wishlist");
    const querySnapshot = await getDocs(query(wishListCollection, where("category", "==", categoryName)));

    // Iterate through the documents and delete each one
    const deletePromises = querySnapshot.docs.map(async(doc) => {
        await deleteDoc(doc.ref);
    });
    await Promise.all(deletePromises);
}

const updateCategoryInFirebase = async(oldCategory: string, newCategory: string) => {
    const wishListCollection = collection(db, "Wishlist");
    const querySnapshot = await getDocs(query(wishListCollection, where("category", "==", oldCategory)));

    // Iterate through the documents and update the category field
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const docRef = doc(db, "Wishlist", docSnapshot.id);
        await updateDoc(docRef, { category: newCategory });
    });
    
    await Promise.all(updatePromises);
}

export {
    fetchCategoryListFromFirebase, 
    fetchWishListItemsFromFirebase, 
    updatePurchaseStatusInFirebase, 
    deleteWishListInFirebase, 
    addWishListInFirebase, 
    deleteCategoryInFirebase, 
    updateCategoryInFirebase
}