"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    emailId: zod_1.z.string().email({ message: "Invalid email" }),
    password: zod_1.z.string().max(50, { message: "Must be 50 or fewer characters long" }).min(8, { message: "Must be 8 or more characters long" }),
});
