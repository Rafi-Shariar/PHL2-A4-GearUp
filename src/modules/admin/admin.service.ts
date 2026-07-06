import { ActiveStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const addNewCategoryInDB = async (categoryName : string) =>{

    const isCategoryExists = await prisma.category.findFirst({
        where : {
            categoryName : {
                equals : categoryName,
                mode : "insensitive"
            }
        }
    })

    if(isCategoryExists){
        throw new Error("This category already exists.")
    }

    const result = await prisma.category.create({
        data : {categoryName}
    })

    return result


}

const getAllUsersFromDB = async() =>{

    const result = await prisma.user.findMany({
        omit : {
            password : true
        }
    })
    return result
}

const updateUserStatusInDB = async(userId : string, status : string) =>{

    const user = await prisma.user.findFirstOrThrow({
        where : {userId}
    })

    const updatedUser = await prisma.user.update({
        where : {userId},
        data : {
            accountStatus: status as ActiveStatus
        }
    })

    return updatedUser
}

const getAllGearsFromDB = async() =>{
    const gears = await prisma.gearItems.findMany({
        include : {
            provider : {
                omit : {
                    password : true
                }
            },
            category : true
        },
        omit : {
            gearId : true,
            providerId : true,
            categoryId : true,
        }
    })
    return {
        totalGears : gears.length,
        gears : gears
    }
}

const getAllOrdersFromDB = async() =>{
    //todo : add filter
    const orders = await prisma.rentalOrders.findMany({
        include : {
            user : {
                select : {
                    email : true,
                    name : true,
                    phoneNumber : true,
                    address : true,
                    accountStatus : true
                }
            },
            gear : {
                select : {
                    brand : true,
                    title : true,
                    price : true,
                    category : {
                        select : {
                            categoryName : true
                        }
                    },
                    provider : {
                        select : {
                            userId : true,
                            email : true,
                            name : true,
                            phoneNumber : true,
                            address : true,
                            accountStatus : true
                        }
                    }
                }
            }
        }
    })

    return {
        totalOrder : orders.length,
        orders
    };

}

export const adminServices = {addNewCategoryInDB, getAllGearsFromDB, getAllOrdersFromDB, getAllUsersFromDB, updateUserStatusInDB}