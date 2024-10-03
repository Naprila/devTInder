import { Gender, Prisma } from "@prisma/client";
import { z } from "zod";

export const schema = z.object({
    firstName: z.string().max(20).min(1),
    lastName: z.string().max(20).min(1).optional(),
    emailId: z.string().email(),
    password: z.string().max(50).min(8),
    age: z.number().min(18),
    gender: z.nativeEnum(Gender),
    photoUrl: z.string().url().optional(),
    about: z.string().max(200).optional(),
    skills: z.string().array()
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>

export const UserValidation = Prisma.defineExtension({
    query: {
        user: {
            
        }
    }
})



