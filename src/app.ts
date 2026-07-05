import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { authRoutes } from "./modules/auth/auth.route";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { adminRoutes } from "./modules/admin/admin.route";


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

//authentication routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)


app.use(notFound)
app.use(globalErrorHandler)
export default app;