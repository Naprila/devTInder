import { Gender, Prisma } from "@prisma/client";
import { z } from "zod";


// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

export const schema = z.object({
    firstName: z.string().max(20).min(1),
    lastName: z.string().max(20).min(1).optional(),
    emailId: z.string().email().trim(),
    password: z.string().max(70).min(8,{ message: 'Must have at least 1 character' }).regex(passwordValidation, {
        message: 'Your password is not valid',
      }),
    age: z.number().min(18).optional(),
    gender: z.nativeEnum(Gender),
    photoUrl: z.string().url().optional(),
    about: z.string().max(200).optional(),
    skills: z.string().array()
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>

export const UserValidation = Prisma.defineExtension({
    query: {
        user: {
            create({ args, query }) {
                args.data = schema.parse(args.data);
                return query(args);
            },
        }
    }
})



