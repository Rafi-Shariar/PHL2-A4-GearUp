import { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { INewReviewPayload } from "./review.interface"

const addNewReviewInDB = async (payload : INewReviewPayload, customerId : string) =>{

    const {orderId, ratings, comment} = payload

    const order = await prisma.rentalOrders.findUniqueOrThrow({
        where : {orderId}
    })

    if(order.customerId !== customerId){
        throw new Error("This order does not belong to you. Can't place review.")
    }

    if(order.status !== OrderStatus.RETURNED){
        throw new Error("You have not returned the gear yet. Can't add review now.")
    }

    if(ratings < 0.00 || ratings > 5.00){
        throw new Error("Ratings must be between 0 to 5.")
    }

    const result = await prisma.reviews.create({
        data : {
            userId : customerId,
            gearId : order.gearId,
            ratings : ratings,
            comment: comment
        }
    })

    return result;


}

export const reviewServices = {addNewReviewInDB}