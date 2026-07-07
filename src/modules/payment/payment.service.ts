import Stripe from "stripe";
import { OrderStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted, handleCheckoutFailed } from "./payment.utils";

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
            orderId,
            amount : order.totalAmount
        }
     })

    return {
        paymentURL : session.url
    };
}

const handleWebhook = async(payload : Buffer, signature : string) =>{
    const endPointSecrete = config.webhook_secrete;

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endPointSecrete
    )

    switch (event.type){
        case "checkout.session.completed" : 
            await handleCheckoutCompleted(event.data.object)
            break;
        case "charge.failed" :
            await handleCheckoutFailed(event.data.object as Stripe.Charge);
            break
        default :
            console.log(`Unhandle even type : ${event.type}`);
            break
            
    }

}

const getUsersPaymentFromDB = async(userId : string) =>{

    const result = await prisma.payment.findMany({
        where : {customerId : userId},
    })

    return result;

}

const getPayemntDetails = async(userId : string, paymentId : string) =>{

    const paymentDetails = await prisma.payment.findUniqueOrThrow({
        where : {
            paymentId,
            customerId : userId
        },
        include : {
            order : {
                include : {
                    gear : {
                        select : {
                            gearId : true,
                            brand : true,
                            title : true,
                            price : true,
                            imageURL : true
                        }
                    }
                },
                omit : {
                    gearId : true
                }
            }
        },
        omit : {
            orderId : true,
        }
    })


    return paymentDetails;


}

export const paymentServices = {createCheckoutSession, handleWebhook, getUsersPaymentFromDB, getPayemntDetails}
