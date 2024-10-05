import { Gender } from "@prisma/client";
import { z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

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

export const editProfileSchema = z.object({
    firstName: z.string().max(20).min(1).optional(),
    lastName: z.string().max(20).min(1).optional(),
    age: z.number({ message: "Age should be a number"}).gte(18).optional(),
    gender: z.nativeEnum(Gender).optional(),
    photoUrl: z.string().url({ message: "URL is incorrect"}).optional(),
    about: z.string().max(200, { message: 'Cannot exceed more than 200 characters'}).optional(),
    skills: z.string().array().max(10, { message: 'Cannot add more than 10 skills'}).optional()
})

export const currentPasswordSchema = z.object({
    currentPassword: z.string().max(70).min(8,{ message: 'Must be atleast 8 character long' }).regex(passwordValidation, {
        message: 'Invalid password',
      })
})

export const changePasswordSchema = z.object({
    newPassword: z.string().max(70).min(8,{ message: 'Must be atleast 8 character long' }).regex(passwordValidation, {
        message: 'Invalid password',
      }),
    confirmPassword: z.string().max(70).min(8,{ message: 'Must be atleast 8 character long' }).regex(passwordValidation, {
        message: 'Invalid password',
      })
}).refine((data) => data.confirmPassword === data.newPassword, {
    message: "New password and confirmation must match",
    path: ["confirmPassword"]
})

export interface TokenInterface {
       emailId: string;
  }