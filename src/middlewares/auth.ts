import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { TokenInterface } from "../utils/validation";
import prisma from "../prisma";


export interface SanitizedUser {
    firstName: string,
    lastName: string | null,
    emailId: string
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token")
        }
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined in environment variables");
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY) as TokenInterface
        const { emailId } = decodedData

        const user: SanitizedUser | null = await prisma.user.findUnique({
            where: {
                emailId: emailId
            },
            select: {
                firstName: true,
                lastName: true,
                emailId: true
            }
        })

        if (!user) {
            throw new Error("Invalid token, try login again")
        }
        req.user = user 
        next()
    } catch (error: any) {
        console.error('Error:', error.message)
        res.status(500).send(`Internal Server Error", ${error.message}`)
    }
}