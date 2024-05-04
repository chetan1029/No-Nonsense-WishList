export interface CategoryItem{
    id: string,
    name: string,
}

export interface WishListItem{
    id: string,
    title: string,
    category: string,
    price: number,
    image: string,
    url: string,
    purchase: boolean,
    createdDate: any,
}

export interface UserType{
    uid: string,
    displayName: string,
    email: string,
    isAnonymous: boolean,
}

export interface SettingsType{
    themeMode: string,
    language: string
}