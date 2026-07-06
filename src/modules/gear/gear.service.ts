import { GearItemsWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGearQuery } from "./gear.interface"

const getAllGearFromDB = async(query : IGearQuery) =>{

    //pagination
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || "price";
    const sortOrder = query.sortOrder || "desc";

    const andConditions : GearItemsWhereInput[] = [];

    // searching
    if(query.searchTerm){
        andConditions.push({
            OR : [
                {title : {contains : query.searchTerm, mode: "insensitive"}},
                {description : {contains : query.searchTerm, mode: "insensitive"}}
            ]
        })
    }

    //filtering
    if (query.category){
        const categoryNameData = await prisma.category.findFirst({
            where : {
                categoryName : {
                    equals : query.category as string,
                    mode : "insensitive"
                }
            }
        })

        if(categoryNameData){
            andConditions.push({categoryId : categoryNameData.categoryId})
        }
        else{
            andConditions.push({categoryId : "Wrong Id"})
        }
    }

    if(query.brand){
        andConditions.push({
            brand : {
                equals : query.brand as string,
                mode : "insensitive"
            }
        })
    }

    const whereConditions = andConditions.length > 0 ? {AND : andConditions} : {};

    const gearItems = await prisma.gearItems.findMany({
        where : whereConditions,
        take : limit,
        skip : skip,
        orderBy : { [sortBy] : sortOrder},
        select : {
            gearId : true,
            category : {
                select : {categoryName : true}
            },
            brand : true,
            title : true,
            price : true,
            stock : true,
            imageURL : true,

        }
    })

    const formattedGearItems = gearItems.map((item : any)=>({
        ...item,
        category : item.category?.categoryName
    }))

    const totalGearItems = await prisma.gearItems.count({
        where : whereConditions
    })



    const result = {
        data :{
            totalItems : totalGearItems,
            gearItems: formattedGearItems,
        },
        meta: {
            page,
            limit,
            totalPages : Math.ceil(totalGearItems/limit) 
        }
    }

    return result;



}

const getGearDetailsFromDB = async() =>{
    
}

const getAllCategoriesFromDB = async() =>{
    
}

export const gearServices = {getAllGearFromDB, getGearDetailsFromDB, getAllCategoriesFromDB}

