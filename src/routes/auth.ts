
import express, { Request, Response } from 'express';
import prisma from '../prisma'; 
import { User } from '@prisma/client';
import { loginSchema } from '../utils/validation';

const router = express.Router()

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { emailId, password }:{ emailId: string, password: string } = req.body

        // todo: validation on input
        const parsedData = loginSchema.safeParse({ emailId, password });
        if  (parsedData.success) {
            console.log("parse succeed:", parsedData.data);
        } else {
            const errorMessages: Record<string, string[]> = {};
            // Organize errors by field
            parsedData.error.issues.forEach(issue => {
                const field = issue.path.join('.');
                if (!errorMessages[field]) {
                    errorMessages[field] = [];
                }
                errorMessages[field].push(issue.message);
            });

            const formattedErrors = Object.entries(errorMessages)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join(' | ');

            throw new Error(`Parsed data failed: ${formattedErrors}`);
        }

        const user: User | null = await prisma.user.findUnique({
            where: {
                emailId: emailId
            }
        });
        
        if (!user) {
            res.status(404).json({msg: "User not found"});
            return;
        }

        // todo: password encryption/hash check
        if (user!.password === password) {
           res.status(200).json({msg: "Login successful"})
           return 
        }

        res.status(401).json({ msg: "Invalid password" })

    } catch (error: any) {
        console.error("Err:", error.message)
        res.status(500).json({msg: "Internal server error", err:error.message })
        return
    }
});

// router.post('/signup', (req: Request, res: Response) => {

// })

// router.post("/logout", (req: Request, res: Response) => {

// })

export default router;