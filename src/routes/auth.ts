
import express, { Request, Response } from 'express';
import prisma from '../prisma'; 
import { User } from '@prisma/client';
import { loginSchema, signupSchema, TokenInterface } from '../utils/validation';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getErrorMessage } from '../utils/utility';
import { unkey } from '../utils/rateLimit';


const router = express.Router()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


router.post('/login', async (req: Request, res: Response): Promise<void> => {
    console.log("Login route called");
    try {
        const { emailId, password }:{ emailId: string, password: string } = req.body

        const parsedData = loginSchema.safeParse({ emailId, password });
        if  (parsedData.success) {
        } else {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(`${formattedErrors}`);
        }

        const ratelimit = await unkey.limit(emailId);
        if (!ratelimit.success){
            res.status(429).json({msg: `You have ${ratelimit.remaining} attempts left, try again after sometime`});
            return
        }

        const user: User | null = await prisma.user.findUserByEmail(emailId)
        
        if (!user) {
            res.status(404).json({msg: "Invalid credentials"});
            return;
        }

        const validPassword: boolean = await bcrypt.compare(password, user.password);

        if (validPassword) {
            if (!JWT_SECRET_KEY) {
                throw new Error("JWT_SECRET_KEY is not defined in environment variables");
            }
            const token = jwt.sign({ emailId: user.emailId }, JWT_SECRET_KEY, { expiresIn: '1d'} )
            res.cookie('token', token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)})
           res.status(200).json({msg: "Login successful"})
           return 
        }

        res.status(401).json({ msg: "Invalid credentials" })
        return
    } catch (error: any) {
        console.error("Err:", error.message)
        res.status(500).json({msg: "Internal server error", err:error.message })
        return
    }
});

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedData = signupSchema.safeParse(req.body)
        if (!parsedData.success) {
            const formattedErrors = getErrorMessage(parsedData)
            throw new Error(`${formattedErrors}`);
        }
        
        const { firstName, lastName, emailId, password, gender} = req.body
        const ratelimit = await unkey.limit(emailId);
        if (!ratelimit.success){
            res.status(429).json({msg: `You have ${ratelimit.remaining} attempts left, try again after sometime`});
            return
        }

        const hashedPassword: string = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                emailId,
                password: hashedPassword,
                gender
            }
        })
        res.status(200).send({msg: "User registered!"})
        return
    } catch (error: any) {
        console.error("Err:", error.message)
        res.status(500).json({msg: "Internal server error", err:error.message })
        return
    }
})

router.post("/logout", (req: Request, res: Response) => {
    try {
        res.clearCookie("token")
        res.status(200).send({msg: "logged out"})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({err: error.message})
    }
})

export default router;