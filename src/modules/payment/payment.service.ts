import { OrderStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async(userId : string, orderId : string) =>{

    const order = await prisma.rentalOrders.findUniqueOrThrow({
        where : {orderId},
        include : {
            user : true
        }
    })
    
     if(order.user.userId !== userId){
        throw new Error("This order does not belong to you.")
     }

     if(order.status !== OrderStatus.CONFIRMED){
        throw new Error(`You can't pay for this order now. This order has been ${order.status}`)
     }


     const session = await stripe.checkout.sessions.create({
        line_items:[{
          price_data :{
            currency : "usd",
            unit_amount : Math.round(order.totalAmount * 100),
            product_data : {
                name : `Payment for order #${orderId}`,
                description : "Thanks for renting from GearUp"
            }
          },
          quantity : 1
        }],
        mode : "payment",
        payment_method_types : ["card"],
        customer_email : order.user.email,
        success_url : `${config.app_url}/payment?success=true`,
        cancel_url : `${config.app_url}/payment?success=false`,
        metadata : {
            userId,
            orderId
        }
     })

    return {
        paymentURL : session.url
    };
}

const handleWebhook = async() =>{

}

const getUsersPaymentFromDB = async() =>{

}

const getPayemntDetails = async() =>{

}

export const paymentServices = {createCheckoutSession, handleWebhook, getUsersPaymentFromDB, getPayemntDetails}
