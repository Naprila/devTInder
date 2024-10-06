import express, { Request, Response, Router } from "express"
import { authMiddleware } from "../middlewares/auth";
import { reviewConnectionSchema, sendConnectionSchema } from "../utils/validation";
import { getErrorMessage } from "../utils/utility";
import prisma from "../prisma";
import { Prisma, Status } from "@prisma/client";

const router = express.Router()

router.post("/send/:status/:userId", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { status, userId } = req.params as { status: Status, userId: string}
        const parsedData = sendConnectionSchema.safeParse({ status, userId })
        if (!parsedData.success) {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(formattedErrors)
        }

        // cannot send req to yourself
        if (userId === req.user?.id) {
            throw new Error("Cannot send connection request to yourself")
        }

        // user with userId exist
        const userExist = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!userExist) {
            throw new Error("Invalid user")
        }

        const isReqFound = await prisma.connectionRequest.findFirst({
            where: {
                OR: [
                    {
                        fromUserId: req.user?.id,
                        toUserId: userId
                    },
                    {   
                        toUserId: req.user?.id,
                        fromUserId: userId
                    }
                ]
            }
        })
        if (isReqFound != null) {
            throw new Error("Connection request already exist")
        }

        const userData = await prisma.connectionRequest.create({
            data: {
                fromUserId: req.user!.id,
                toUserId: userId,
                status: status
            }
        })

        res.status(200).send({ msg: "Connection request sent", userData })
        return
    } catch (error: any) {
        console.log("Err:", error.message)
        res.status(400).send({ err: error.message })
    }
})


router.post('/review/:status/:requestId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { status, requestId } = req.params as { status: Status, requestId: string}
        const parsedData = reviewConnectionSchema.safeParse({ status, requestId})
        if ( !parsedData.success ) {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(formattedErrors)
        }

        const data = await prisma.connectionRequest.update({
            where: {
                id: requestId,
                toUserId: req.user!.id,
                status: Status.LIKE
            },
            data: { 
                status: status
            },
            include: {
                toUser: {
                    select: {
                        firstName: true,
                        emailId: true,
                    }
                }
            }
        })
        res.status(200).send({ msg: "Request accepted", data})    
    } catch (error: any) {
        console.log(error.message)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                // Record not found error
                res.status(404).send({ err: "Connection request not found or has already been processed." });
            } else {
                // Handle other known Prisma errors
                res.status(400).send({ err: "An error occurred while processing your request." });
            }
        } else {
            // Handle other unexpected errors
            res.status(500).send({ err: error.message });
        }
    } 
})

export default router;