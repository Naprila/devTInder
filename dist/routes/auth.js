"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../prisma"));
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId, password } = req.body;
        // todo: validation on input
        const parsedData = validation_1.loginSchema.safeParse({ emailId, password });
        if (parsedData.success) {
            console.log("parse succeed:", parsedData.data);
        }
        else {
            const errorMessages = {};
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
        const user = yield prisma_1.default.user.findUnique({
            where: {
                emailId: emailId
            }
        });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        // todo: password encryption/hash check
        if (user.password === password) {
            res.status(200).json({ msg: "Login successful" });
            return;
        }
        res.status(401).json({ msg: "Invalid password" });
    }
    catch (error) {
        console.error("Err:", error.message);
        res.status(500).json({ msg: "Internal server error", err: error.message });
        return;
    }
}));
// router.post('/signup', (req: Request, res: Response) => {
// })
// router.post("/logout", (req: Request, res: Response) => {
// })
exports.default = router;
