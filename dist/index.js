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
const auth_1 = __importDefault(require("./routes/auth"));
const client_1 = require("@prisma/client");
// import prisma from "./prisma"
// import path from 'path';
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/", auth_1.default);
// Serve static files from the public directory
// app.use('/public', express.static(path.join(__dirname, 'src/public')));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log("Connected to the database successfully!");
            app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
                yield prisma.user.create({
                    data: {
                        firstName: 'Rich',
                        lastName: 'Gandu',
                        emailId: ' hello@prisma1.com',
                        password: '123123123',
                        gender: client_1.Gender.FEMALE,
                    },
                });
                const allUsers = yield prisma.user.findMany({});
                console.log(allUsers);
                res.send("Server is alive");
                // try {
                //   const connectionRequest = await prisma.connectionRequest.create({
                //     data: {
                //       fromUserId: "abcde", // Ensure this is a valid ObjectId
                //       toUserId: "fedcba", // Ensure this is a valid ObjectId
                //       status: Status.INTERESTED, 
                //     }
                //   });
                //   console.log('Connection Request Created:', connectionRequest);
                //   res.send("Server is alive");
                // } catch (error) {
                //   console.error('Error creating connection request:', error);
                //   res.status(500).send("Error creating connection request");
                // }
            }));
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error('Failed to connect to the database:', error);
            console.log('Error catch:', error);
        }
    });
}
main()
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    process.exit(1);
}))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
