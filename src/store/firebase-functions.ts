import firestore from '@react-native-firebase/firestore';
import { CategoryItem, WishListItem } from './types';

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

const fetchCategoryListFromFirebase = async(userId: string) => {
    let categoryItems: CategoryItem[] = [];
    await firestore()
        .collection('Category')
        .where('userId', '==', userId)
        .get()
        .then((categorySnapshot) => {
        if (!categorySnapshot.empty) {
            categoryItems = categorySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            }));
        }
        });
    return categoryItems;
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
    // Check if the category already exists
    const categoryQuerySnapshot = await firestore()
      .collection('Category')
      .where('name', '==', category)
      .where('userId', '==', userId)
      .get();

    // If category doesn't exist, add it
    if (categoryQuerySnapshot.empty) {
      await firestore().collection('Category').add({
        name: category,
        userId: userId,
      });

      console.log('Category added successfully.');
    } else {
      console.log('Category already exists.');
    }

    await firestore().collection('Wishlist').add(
        { 
            "category": category, 
            "url": url,
            "title": title, 
            "price": price, 
            "purchase": false, 
            "image": thumbnailImage,
            "createDate": firestore.FieldValue.serverTimestamp(),
            "userId": userId,
        }
    )
}

const deleteCategoryInFirebase = async(categoryName: string, userId: string) => {
    // delete in category
    const categorySnapshot = await firestore()
    .collection('Category')
    .where("userId", "==", userId)
    .where("name", "==", categoryName)
    .get();

    categorySnapshot.forEach(doc => {
        const categoryRef = firestore().collection('Category').doc(doc.id);
        categoryRef.delete().then(() => {
            console.log("Category deleted successfully");
        }).catch(error => {
            console.error("Error deleting category: ", error);
        });
    });

    // delete in wishlist
    const wishListCollection =  await firestore().collection('Wishlist').where("userId", "==", userId).where("category", "==", categoryName).get()

    const batch = firestore().batch();
    wishListCollection.forEach(documentSnapshot => {
        batch.delete(documentSnapshot.ref);
      });
    return batch.commit();
}

const updateCategoryInFirebase = async(oldCategory: string, newCategory: string, userId: string) => {
    // Update in category
    const categorySnapshot = await firestore()
    .collection('Category')
    .where("userId", "==", userId)
    .where("name", "==", oldCategory)
    .get();

    categorySnapshot.forEach(doc => {
        const categoryRef = firestore().collection('Category').doc(doc.id);
        categoryRef.update({
            name: newCategory
        }).then(() => {
            console.log("Category name updated successfully");
        }).catch(error => {
            console.error("Error updating category name: ", error);
        });
    });

    // Update in wishlist
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
    updateCategoryInFirebase,
    fetchCategoryListFromFirebase
}