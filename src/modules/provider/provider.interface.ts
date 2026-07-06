export interface IAddGearPayload {
    categoryId : string;
    brand : string;
    title : string;
    price : number;
    description : string;
    stock : number;
    imageURL ?: string
}