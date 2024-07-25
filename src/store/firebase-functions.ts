import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { CategoryItem, SharedWishListItem, WishListItem, AlertMessageDetailItem, WishAiItem } from './types';

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
                comment: doc.data().comment,
                image: doc.data().image,
                createdDate: doc.data().createdDate,
                purchase: doc.data().purchase,
                scrapedStatus: doc.data()?.scraped_status,
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

const addWishListInFirebase = async(category: string, url: string, comment: string, title: string, price: string, thumbnailImage: string, userId: string) => {
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

    const wishListDocRef = await firestore().collection('Wishlist').add(
        { 
            "category": category, 
            "url": url,
            "title": title, 
            "price": price, 
            "comment": comment,
            "purchase": false, 
            "image": thumbnailImage,
            "createDate": firestore.FieldValue.serverTimestamp(),
            "userId": userId,
            "scraped_status": false,
        }
    )
    return wishListDocRef.id;
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
    batch.commit();

    // Delete in SharedWishList
    const sharedWishListCollection = await firestore().collection('SharedWishList').where("userId", "==", userId).where("categoryName", "==", categoryName).get()
    const sharedBatch = firestore().batch();
    sharedWishListCollection.forEach(documentSnapshot => {
        sharedBatch.delete(documentSnapshot.ref);
    });
    await sharedBatch.commit();
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
    batch.commit();

    // Update in wishlist
    const sharedWishListCollection =  await firestore().collection('SharedWishList').where("userId", "==", userId).where("categoryName", "==", oldCategory).get()
    const shareBatch = firestore().batch();
    sharedWishListCollection.forEach(documentSnapshot => {
        shareBatch.update(documentSnapshot.ref, {"categoryName": newCategory});
      });
    return shareBatch.commit();
}

const fetchSharedWishListFromFirebase = async(userId: string) => {
    let sharedWishList: SharedWishListItem[] = [];
    await firestore()
        .collection('SharedWishList')
        .where('sharedWithUserId', '==', userId)
        .get()
        .then((wishListSnapshot) => {
            if (!wishListSnapshot.empty) {
                sharedWishList = wishListSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    categoryId: doc.data().categoryId,
                    categoryName: doc.data().categoryName,
                    sharedWithUserId: doc.data().sharedWithUserId,
                    userId: doc.data().userId,
                    createdDate: doc.data().createdDate,
                    userName: doc.data().userName,
                }));
            }
        });
    return sharedWishList;
}

const fetchSharedWishListItemsFromFirebase = async(userId: string, category: string) => {
    let sharedWishlistItems: WishListItem[] = [];
    await firestore().collection('Wishlist').where("userId", "==" , userId).where("category", "==", category).where("purchase", "==", false).orderBy('createDate', 'desc').get().then((wishlistSnapshot) => {
        if (!wishlistSnapshot.empty) {
            sharedWishlistItems = wishlistSnapshot.docs.map((doc) => ({
                id: doc.id,
                category: doc.data().category,
                url: doc.data().url,
                title: doc.data().title,
                price: doc.data().price,
                comment: doc.data().comment,
                image: doc.data().image,
                createdDate: doc.data().createdDate,
                purchase: doc.data().purchase,
            }));
        }
    });
    return sharedWishlistItems;
}

const removeFromSharedWishListInFirebase = async(sharedWishListId: string, userId: string) => {
    // delete in SharedWishList
    await firestore()
    .collection('SharedWishList')
    .doc(sharedWishListId)
    .delete();
}

const addToSharedWishListInFirebase = async(categoryId: string, userName: string, userId: string, t:any) => {
    let AlertMessageDetails = {title: '', message: '', action: ''};

    const categorySnapshot = await firestore()
      .collection('Category')
      .doc(categoryId)
      .get();
    
    if (categorySnapshot.exists) {
        const categoryData = categorySnapshot.data();
        if (categoryData) {
            const categoryName = categoryData.name;
            const sharedFromUserId = categoryData.userId;

            if(userId !== sharedFromUserId) {
                const sharedWishList = await firestore()
                                        .collection('SharedWishList')
                                        .where("userId", "==", sharedFromUserId)
                                        .where("sharedWithUserId", "==", userId)
                                        .where("categoryId", "==", categoryId)
                                        .get();

                if(sharedWishList.empty){
                    await firestore().collection('SharedWishList').add(
                        { 
                            "categoryId": categoryId, 
                            "userId": sharedFromUserId,
                            "createdDate": firestore.FieldValue.serverTimestamp(),
                            "sharedWithUserId": userId,
                            "categoryName": categoryName,
                            "userName": userName,
                        }
                    )
                    AlertMessageDetails = {title: 'Success', message: t('sharedWishlistSuccessfully', {categoryName}), action: ''};
                }else{
                    console.log('already exists')
                    AlertMessageDetails = {title: 'Information', message: t('sharedWishlistAlreadyExists', {categoryName}), action: ''};
                }
            }else{
                console.log('cannot share with yourself');
                AlertMessageDetails = {title: 'Information', message: t('canNotAddYouselfToWishlist'), action: ''};
            } 
        }else{
            console.log('WishList SnapShot not found.');
            AlertMessageDetails = {title: 'Error', message: t('wishListNotFound'), action: ''};
        }
      } else {
        console.log('WishList not found.');
        AlertMessageDetails = {title: 'Error', message: t('wishListNotFound'), action: ''};
      }

      return AlertMessageDetails;
}

const deleteWishListByUserInFirebase = async(userId: string) => {
    // Delete in Category
    const userCategoryCollection = await firestore().collection('Category').where("userId", "==" , userId).get();
    const categoryBatch = firestore().batch();
    userCategoryCollection.forEach(documentSnapshot => {
        categoryBatch.delete(documentSnapshot.ref);
      });
    categoryBatch.commit();

    // Delete in WishList
    const userWishListCollection = await firestore().collection('Wishlist').where("userId", "==" , userId).get();
    const batch = firestore().batch();
    userWishListCollection.forEach(documentSnapshot => {
        batch.delete(documentSnapshot.ref);
      });
    batch.commit();

    // Delete in SharedWishList
    const sharedWishListCollection = await firestore().collection('SharedWishList').where("userId", "==", userId).get()
    const sharedBatch = firestore().batch();
    sharedWishListCollection.forEach(documentSnapshot => {
        sharedBatch.delete(documentSnapshot.ref);
    });
    await sharedBatch.commit();
}

const updateUserNameOnSharedWishListInFirebase = async(userId: string, userName: string) => {
    const sharedWishListCollection = await firestore().collection('SharedWishList').where("userId", "==", userId).get()
    const batch = firestore().batch();
    sharedWishListCollection.forEach(documentSnapshot => {
        batch.update(documentSnapshot.ref, {"userName": userName});
      });
    await batch.commit();
}

// fetch Guide AI
const fetchWishAiFromFirebase = async(type: string, userId: any, language: string) => {
    let wishAiItem: WishAiItem[] = [];
    let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection('wishAi');
    if (type === 'user-history' && userId) {
        query = query.where("type", "==", "user-history").where("userId", "==", userId);
    }else{
        query = query.where("type", "==", "general").where("language", "==", language);
    }
    query = query.orderBy('status.startTime', 'desc')
    try {
        await query.get().then((wishAiSnapshot) => {
            if (!wishAiSnapshot.empty) {
                wishAiItem = wishAiSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    prompt: doc.data().prompt,
                    response: doc.data().response,
                    type: doc.data().type,
                    status: doc.data().status,
                    userId: doc.data().userId,
                    category: doc.data().category,
                }))
                .filter((item) => item.status.state !== "ERROR");
            }
        });
    } catch (error) {
        console.error("Error fetching wishAi from Firebase:", error);
    }
    return wishAiItem;
}

// search via Guide AI
const searchViaWishAiFromFirebase = async(prompt: string, type: string, userId: any) => {
    const wishAiDocRef = await firestore().collection('wishAi').add(
        { 
            "type": type, 
            "prompt": prompt,
            "userId": userId,
        }
    )
    return wishAiDocRef.id;
}

// fetch Guide AI Search
const fetchWishAiItemFromFirebase = async(guideId: string) => {
    try {
        const wishAiSnapshot = await firestore().collection('wishAi').doc(guideId).get();
        
        if (wishAiSnapshot.exists) {
            const data = wishAiSnapshot.data();
            if (data) {
                return {
                    id: wishAiSnapshot.id,
                    prompt: data.prompt,
                    response: data.response,
                    type: data.type
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Error fetching Wish AI item:", error);
        return null;
    }
}

// fetch Wish AI WishList
const fetchWishAiWishItemsFromFirebase = async(userId: string, category: string) => {
    let wishlistItems: WishListItem[] = [];
    await firestore().collection('Wishlist').where("userId", "==" , userId).where("category", "==" , category).orderBy('createDate', 'desc').get().then((wishlistSnapshot) => {
        if (!wishlistSnapshot.empty) {
            wishlistItems = wishlistSnapshot.docs.map((doc) => ({
                id: doc.id,
                category: doc.data().category,
                url: doc.data().url,
                title: doc.data().title,
                price: doc.data().price,
                comment: doc.data().comment,
                image: doc.data().image,
                createdDate: doc.data().createdDate,
                purchase: doc.data().purchase,
                scrapedStatus: doc.data()?.scraped_status,
            }));
        }
    });
    return wishlistItems;
}

export { 
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
    addToSharedWishListInFirebase,
    deleteWishListByUserInFirebase,
    updateUserNameOnSharedWishListInFirebase,
    fetchWishAiFromFirebase,
    searchViaWishAiFromFirebase,
    fetchWishAiItemFromFirebase,
    fetchWishAiWishItemsFromFirebase
}