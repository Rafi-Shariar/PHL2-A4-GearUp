export interface IAddGearPayload {
    categoryId : string;
    brand : string;
    title : string;
    price : number;
    description : string;
    stock : number;
    imageURL ?: string
}

export interface IUpdateGearPayload {
    categoryId ?: string;
    brand ?: string;
    title ?: string;
    price ?: number;
    description ?: string;
    stock ?: number;
    imageURL ?: string
}
