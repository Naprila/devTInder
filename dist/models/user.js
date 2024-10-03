"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.schema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.schema = zod_1.z.object({
    firstName: zod_1.z.string().max(20).min(1),
    lastName: zod_1.z.string().max(20).min(1).optional(),
    emailId: zod_1.z.string().email(),
    password: zod_1.z.string().max(50).min(8),
    age: zod_1.z.number().min(18).optional(),
    gender: zod_1.z.nativeEnum(client_1.Gender),
    photoUrl: zod_1.z.string().url().optional(),
    about: zod_1.z.string().max(200).optional(),
    skills: zod_1.z.string().array()
});
exports.UserValidation = client_1.Prisma.defineExtension({
    query: {
        user: {}
    }
});
