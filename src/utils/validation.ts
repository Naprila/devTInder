import { Gender } from "@prisma/client";
import { z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

// export const GenderEnum = z.enum(["male", "female", "other"]);

export const loginSchema = z.object({
    emailId: z.string().email({ message: "Invalid email" }).trim(),
    password: z.string().max(70).min(8,{ message: 'Must be atleast 8 character long' }).regex(passwordValidation, {
        message: 'Invalid password',
      }),
})

export const signupSchema = z.object({
    firstName: z.string().max(20).min(1),
    lastName: z.string().max(20).min(1),
    emailId: z.string().email({ message: "Invalid email" }).trim(),
    password: z.string().max(70).min(8,{ message: 'Must be atleast 8 character long' }).regex(passwordValidation, {
        message: 'Invalid password',
        }),
    gender: z.nativeEnum(Gender)
})

export interface TokenInterface {
       emailId: string;
  }