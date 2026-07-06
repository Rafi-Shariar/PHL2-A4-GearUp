import { readSync } from "node:fs"
import { prisma } from "../../lib/prisma"
import { INewOrderPayload } from "./rentalOrder.interface"
import { sendResponse } from "../../utils/sendResponse"

const addNewOrderIntoDB = async(payload : INewOrderPayload, customerId : string) =>{

    const {gearId, quantity, collectionDate,returnDate} = payload


    const gearItem = await prisma.gearItems.findUniqueOrThrow({
        where : {gearId}
    })

    if(gearItem.stock < quantity ){
        throw new Error("insufficient quantity. Please check the stock & order again.")
    }

    const totalAmount = gearItem.price * quantity;

    const orderData = {
        gearId,
        customerId,
        quantity,
        totalAmount,
        collectionDate : new Date(collectionDate),
        returnDate : new Date(returnDate)
    }

    const result = await prisma.rentalOrders.create({
        data : orderData
    })

    return {
        ...result,
        price : gearItem.price
    };


}

const getAllOrdersOfUser = async(customerId : string) =>{

    const orders = await prisma.rentalOrders.findMany({
        where : {customerId},
        include : {
            gear :{
                select : {
                    gearId : true,
                    provider : {
                        select : {
                            name : true,
                            address : true,
                            email : true,
                            phoneNumber : true
                        }

                    },
                    brand : true,
                    title : true
                }
            }
        },
        omit : {
            gearId : true,
        }
    })

    const totalOrder = await prisma.rentalOrders.count({
        where : {customerId}
    })

    return {
        totalOrder,
        orders
    };

}

const getOrderDetailsById = async() =>{

}

export const rentalOrderServices = {addNewOrderIntoDB, getAllOrdersOfUser, getOrderDetailsById}