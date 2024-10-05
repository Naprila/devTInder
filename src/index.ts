
import express, { Express } from "express"
import authRouter from './routes/auth'
import profileRouter from './routes/profile'
import { Gender, PrismaClient } from "@prisma/client"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
// import prisma from "./prisma"
// import path from 'path';

const app : Express = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000 
dotenv.config()

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/profile", profileRouter)

// Serve static files from the public directory
// app.use('/public', express.static(path.join(__dirname, 'src/public')));


async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!")

    app.get('/', async (req, res) => {

    //   await prisma.user.create({ 
    //   data: {
    //     firstName: 'Rich',
    //     lastName: 'Gandu',
    //     emailId: ' hello@prisma1.com',
    //     password: '123123123',
    //     gender: Gender.FEMALE,
    //     age: 18,
    //   },
    // })
    
    // const allUsers = await prisma.user.findMany({})
    // console.log(allUsers)


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
     
    })

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    console.log('Error catch:', error)
  }
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })