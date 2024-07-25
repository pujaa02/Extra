import express, { Application } from "express";
const app: Application = express();
import cors from 'cors';
import { generateDocs } from './utils/GenerateDocs';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { router } from "./routes";
import path from 'path';
import http from 'http';
import { Server } from "socket.io";
import { PORT, BASE_URL } from "./config";


const port = PORT || 8000;
export const prisma = new PrismaClient()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: BASE_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const corsOptions = {
    origin: BASE_URL,
    methods: 'GET, PUT, POST, DELETE',
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};
app.use(cors(corsOptions))
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))
app.use(cookieParser());
app.use(express.json());
app.use(router);


io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}`);

    socket.on('message', (msg) => {
        // console.log('Message received:', msg);
        io.emit('message', msg);
    });

    socket.on("disconnect", () => {
        // console.log('user disconnected');
    })

});
server.listen(port, () => {
    console.log(`Server is running in port: ${port} `);
});


generateDocs(app);
