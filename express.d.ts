import { SanitizedUser } from "./src/middlewares/auth";

declare module 'express' {
    export interface Request {
       user?: SanitizedUser
    }
 }