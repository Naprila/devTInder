import express, { Request, Response, Router } from 'express'
import { authMiddleware } from '../middlewares/auth';
import { changePasswordSchema, currentPasswordSchema, editProfileSchema } from '../utils/validation';
import prisma from '../prisma';
import { getErrorMessage } from '../utils/utility';
import bcrypt from "bcrypt"
import { User } from '@prisma/client';

const router = express.Router()


router.get("/view", authMiddleware, (req: Request, res: Response) => {
    try {
        res.status(200).send(req.user)
    } catch (error: any) {
        console.error(error.message)
        res.status(400).send({err:  error.message})
    }
    return
})

router.patch('/edit', authMiddleware, async (req: Request, res: Response) => {
    try {
        const parsedData = editProfileSchema.safeParse(req.body)
        if (!parsedData.success) {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(`${formattedErrors}`);
        }

        const allowedEditFields = ['age', 'skills', 'photoUrl', 'gender', 'about', 'firstName', 'lastName'];
        const isEditAllow = Object.keys(req.body).every((field) => {
            return allowedEditFields.includes(field) 
        })

        if (!isEditAllow) {
            throw new Error(" You cannot change email and password field")
        }

        const updateData: any = {};
        Object.keys(req.body).forEach((field) => {
            if (allowedEditFields.includes(field)) {
                updateData[field] = req.body[field]
            }
        })

        const updateUser = await prisma.user.update({
            where: {
                emailId: req.user?.emailId
            },
            data: updateData
        })

        console.log(updateUser)
        res.status(200).json({ message: "Profile updated successfully", user: updateUser });
        return
    } catch (error: any) {
        console.error(error.message)
        res.status(400).send({err: error.message})
        return
    }
})

router.post('/verify/current-password', authMiddleware, async (req: Request, res: Response) => {
    try {
        const parsedData = currentPasswordSchema.safeParse(req.body)

        if (!parsedData.success) {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(`${formattedErrors}`);
        }

        const user: User | null = await prisma.user.findUserByEmail(req.user!.emailId);
        if (!user) {
            throw new Error("Invalid user");
        }

        const isPasswordCorrect: boolean = await bcrypt.compare(req.body.currentPassword, user?.password)
        if (!isPasswordCorrect) {
            res.status(401).json({ error: "Current password is incorrect" });
            return
        }

        res.status(200).json({ message: "Current password verified" });
        return

    } catch (error: any) {
        console.error(error.message)
        res.status(400).send({err: error.message})
        return
    }
})


router.patch('/change-password', authMiddleware, async (req: Request, res: Response) => {
    try {
        const parsedData = changePasswordSchema.safeParse(req.body)
        if (!parsedData.success) {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(`${formattedErrors}`);
        }

        // hash the new password
        const hashedPassword: string = await bcrypt.hash(req.body.newPassword, 10)

        await prisma.user.update({
            where: {
                emailId: req.user?.emailId
            },
            data: {
                password: hashedPassword
            }
        })
        res.status(200).json({ message: "Password changed successfully" });
        return
    } catch (error: any) {
        console.error(error.message)
        res.status(400).send({err: error.message})
        return
    }
})

export default router;