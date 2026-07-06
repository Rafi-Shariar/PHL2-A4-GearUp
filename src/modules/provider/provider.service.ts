import { prisma } from "../../lib/prisma"
import { IAddGearPayload, IUpdateGearPayload } from "./provider.interface"

const addGearIntoDB = async(payload : IAddGearPayload, providerId : string) =>{

    const {  categoryId, brand, title, price, description, stock, imageURL} = payload

    //check if category exists
    const isCategoryIdExists = await prisma.category.findUnique({
        where : {categoryId}
    })

    if(!isCategoryIdExists){
        throw new Error("This category does not exits")
    }
    
    // check if same gear was added by same vendor before.
    const isExactGearExistByProvider = await prisma.gearItems.findFirst({
        where : {
            providerId,
            categoryId,
            brand,
            title,
            price,
        }
    })

    if(isExactGearExistByProvider){
        throw new Error("You have already added this same item before. Try updating the stock.")
    }

    const newGear = await prisma.gearItems.create({
        data : {
            providerId,categoryId, brand, title, price, description, stock, imageURL
        }
    })

    return newGear;

}

const updateGearInDB = async(payload : IUpdateGearPayload, userId : string, gearId : string) =>{
    
    const gearItem = await prisma.gearItems.findFirstOrThrow({
        where : {gearId}
    })

    //check: if this item belongs to this provider
    if(gearItem.providerId !== userId){
        throw new Error("This gear does not belong to you. You don't have permission to edit.")
    }

    const updatedGearItem = await prisma.gearItems.update({
        where : {
            gearId
        },
        data : payload
    })

    return updatedGearItem;


}

const deleteGearFromDB = async (userId : string, gearId : string) =>{

     const gearItem = await prisma.gearItems.findFirstOrThrow({
        where : {gearId}
    })

    //check: if this item belongs to this provider
    if(gearItem.providerId !== userId){
        throw new Error("This gear does not belong to you. You don't have permission to delete.")
    }

    const deletedGear = await prisma.gearItems.delete({
        where : {gearId}
    })

    return deletedGear;


}

const getAllOrdersFromDB = async() =>{
    //add filter
    //todo
}

const updateOrderStatus = async() =>{
    //todo

}

export const providerServices = {addGearIntoDB, updateGearInDB, deleteGearFromDB, getAllOrdersFromDB, updateOrderStatus }