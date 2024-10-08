import express, { Request, Response, Router } from "express"
import { authMiddleware } from "../middlewares/auth"
import prisma from "../prisma"
import { Status, User } from "@prisma/client"

const router = express.Router()

// type UserData = {
//     id: string;
//     firstName: string;
//     lastName: string | null;
//     emailId: string;
// };

router.get('/requests', authMiddleware, async (req: Request, res: Response) => {
    // means fromUserId : anyone but toUserId: loggedInUser
    try {
        const users = await prisma.connectionRequest.findMany({
            where: {
                toUserId: req.user!.id,
                status: Status.LIKE
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        emailId: true
                    }
                }
            }
        })
        console.log(users)
        const data = users.map((user) => { 
            return { ...user.fromUser, requestId: user.id } 
        })
        res.status(200).send({ data })
        return
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({ err: error.message })
        return
    }
})

router.get('/connections', authMiddleware, async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user!.id;
        // either i would hv sent the connection and it got accepted -> fromUserId: loggedInUser
        // someone would hv sent to me and i accept it -> toUserId: loggedInUser
        // status: accepted

        const users = await prisma.connectionRequest.findMany({
            where: {
                OR: [
                    {
                        fromUserId: loggedInUserId
                    },
                    {
                        toUserId: loggedInUserId
                    }
                ],
                AND: {
                    status: Status.ACCEPTED
                }
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        emailId: true
                    }
                },
                toUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        emailId: true
                    }
                }
            },
        })  


        const data = users.map((user) => {
            return user.fromUser.id === loggedInUserId ? user.toUser : user.fromUser
        })

        res.status(200).send({ data })

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({ err: error.message })
        return
    }
})


router.get('/feed', authMiddleware, async (req: Request, res: Response) => {
    try {
        let page: number = parseInt(req.query.page as string) || 1;
        let limit: number = parseInt(req.query.limit as string) || 10;

        limit = (limit > 50 || limit < 1) ? 10 : limit

        const loggedInUserId = req.user!.id

        const connReq = await prisma.connectionRequest.findMany({
            where: {
                OR: [
                    {
                        fromUserId: loggedInUserId,
                    },
                    {
                        toUserId: loggedInUserId,
                    }
                ],
            },
        })

        const hideUserFromFeed: Set<string> = new Set();

        connReq.map((request) => {
            hideUserFromFeed.add(request.fromUserId)
            hideUserFromFeed.add(request.toUserId)
        })

        hideUserFromFeed.add(req.user!.id)
        const totalPages = (hideUserFromFeed.size + 1)/ limit
        page = (page < 1 || page > totalPages) ? 1 : page


        const users: User[] | {}[] = await prisma.user.findMany({
            where: {
                id: {
                    notIn: Array.from(hideUserFromFeed)
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                age: true,
                skills: true,
                about: true,
                emailId: true,
                gender: true,
                photoUrl: true
            },
            skip:(page-1)*limit,
            take: limit
        })

        res.status(200).send(users)

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({ err: error.message })
        return
    }
})

export default router