import { z } from "zod";


export const loginSchema = z.object({
    emailId: z.string().email({ message: "Invalid email" }),
    password: z.string().max(50, { message: "Must be 50 or fewer characters long" }).min(8,{ message: "Must be 8 or more characters long" }),
})