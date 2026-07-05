import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app : Application = express()

app.get("/", (req : Request, res:Response) =>{
    res.send("Hello")
})


app.use(notFound)
app.use(globalErrorHandler)
export default app;