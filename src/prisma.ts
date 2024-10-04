import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        user: {
            async findUserByEmail( email: string) : Promise<User | null> {
                return prisma.user.findUnique({
                    where: {
                        emailId: email
                    }
                });
            }
        }
    }
})



export default prisma;