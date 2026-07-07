import { stat } from "node:fs"
import { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IAddGearPayload, IUpdateGearPayload, IUpdateOrderStatusPayload } from "./provider.interface"

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

const getAllOrdersFromDB = async( providerId : string) =>{

    const orders = await prisma.rentalOrders.findMany({
        where : {
            gear : {
                providerId
            }
        },
        include : {
            gear : {
                select : {
                    gearId : true,
                    categoryId : true,
                    brand : true,
                    title : true,
                    price : true,
                    stock : true,
                    imageURL : true
                }
            },
            user : {
                select : {
                    name : true,
                    email : true,
                    phoneNumber : true
                }
            }
        },
        omit : {
            gearId : true,
            customerId : true
        }
    })

    return orders;
    
}

const updateOrderStatus = async(providerId : string, status : string, orderId : string) =>{

    const order = await prisma.rentalOrders.findFirstOrThrow({
        where : {orderId},
        include : {
            gear : true
        }
    })

    if(order.gear.providerId !== providerId){
        throw new Error("You don't have permission to update this order.")
    }

    if(status === OrderStatus.CONFIRMED ){

        if( order.quantity > order.gear.stock){
            throw new Error("You dont have sufficient stock to confirm this order!")
        }

        const transactionResult = await prisma.$transaction(
            async(tx) =>{

                const updatedOrder = await tx.rentalOrders.update({
                    where : {orderId},
                    data : {
                        status : OrderStatus.CONFIRMED
                    }
                })

                await tx.gearItems.update({
                    where : {
                        gearId : order.gearId
                    },
                    data :{
                        stock : {
                            decrement : order.quantity
                        }
                    }
                })

                return updatedOrder;
            }
        )

        return transactionResult
        
    }
    
    if(order.status === OrderStatus.CONFIRMED && status === OrderStatus.CANCELLED){

        const transactionResult = await prisma.$transaction(
            async(tx) =>{
                const updateOrder = await tx.rentalOrders.update({
                    where : {orderId},
                    data : {
                        status : OrderStatus.CANCELLED
                    }
                })

                await tx.gearItems.update({
                    where : { gearId : order.gearId},
                    data : {
                        stock : {
                            increment : order.quantity
                        }
                    }
                })

                return updateOrder;
            }
        )

    }

    if(status === OrderStatus.RETURNED){
         const transactionResult = await prisma.$transaction(
            async(tx) =>{
                const updaterder = await tx.rentalOrders.update({
                    where : {orderId},
                    data : {
                        status : OrderStatus.RETURNED
                    }
                })

                await tx.gearItems.update({
                    where : { gearId : order.gearId},
                    data : {
                        stock : {
                            increment : order.quantity
                        }
                    }
                })
            }
         )
    }

    const updatedOrder = await prisma.rentalOrders.update({
        where : {orderId},
        data : {status : status as OrderStatus}
    })

    return updatedOrder;
    


    
    

}

export const providerServices = {addGearIntoDB, updateGearInDB, deleteGearFromDB, getAllOrdersFromDB, updateOrderStatus }