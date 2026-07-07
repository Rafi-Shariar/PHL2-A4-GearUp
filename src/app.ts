import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { authRoutes } from "./modules/auth/auth.route";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { adminRoutes } from "./modules/admin/admin.route";
import { providerRoutes } from "./modules/provider/provider.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalOrderRoutes } from "./modules/rentalOrders/rentalOrder.route";
import { reviewRoutes } from "./modules/review/review.route";
import { userRoutes } from "./modules/user/user.route";
import { paymentRoutes } from "./modules/payment/payment.route";


const app : Application = express()
app.use(cors({
    origin: config.app_url,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/", (req : Request, res:Response) =>{
    res.send("Hello")
})


app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/provider", providerRoutes)
app.use("/api", gearRoutes)
app.use("/api/rentals", rentalOrderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/user", userRoutes)
app.use("/api/payments", paymentRoutes)


app.use(notFound)
app.use(globalErrorHandler)
export default app;