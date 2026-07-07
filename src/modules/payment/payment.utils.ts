import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { OrderStatus, PaymentStatus } from "../../../generated/prisma/enums";

export const handleCheckoutCompleted = async( session : Stripe.Checkout.Session) =>{

    const userId = session.metadata?.userId as string;
    const orderId = session.metadata?.orderId as string;
    const amount = session.metadata?.amount;
    const transactionId = session.payment_intent as string;
    
    //console.log(session, "session Data from webhook");
    

    if(!userId || !orderId){
        throw new Error("Webhook Failed: missing required session data")
    }

    await prisma.$transaction(
        async(tx) =>{

            await tx.rentalOrders.update({
                where : {orderId},
                data : {
                    status : OrderStatus.PAID
                }
            })

            await tx.payment.create({
                data : {
                    transactionId,
                    customerId : userId,
                    orderId,
                    amount : Number(amount),
                    method : "card",
                    status : PaymentStatus.SUCCESSFULL
                }
            })
        }
    )


}