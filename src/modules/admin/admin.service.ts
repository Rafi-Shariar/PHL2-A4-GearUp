import { prisma } from "../../lib/prisma"

const addNewCategoryInDB = async (categoryName : string) =>{

    const isCategoryExists = await prisma.category.findUnique({
        where : {categoryName}
    })

    if(isCategoryExists){
        throw new Error("This category already exists.")
    }

    const result = await prisma.category.create({
        data : {categoryName}
    })

    return result


}

export const adminServices = {addNewCategoryInDB}