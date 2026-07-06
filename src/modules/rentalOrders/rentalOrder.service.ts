import { prisma } from "../../lib/prisma"
import { INewOrderPayload } from "./rentalOrder.interface"

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

const getAllOrdersOfUser = async() =>{

}

const getOrderDetailsById = async() =>{

}

export const rentalOrderServices = {addNewOrderIntoDB, getAllOrdersOfUser, getOrderDetailsById}