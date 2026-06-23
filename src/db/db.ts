import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	connectionLimit: parseInt(process.env.CONNECTION_LIMIT || "1", 10),
	acquireTimeout: parseInt(process.env.ACQUIRE_TIMEOUT || "20000", 10), // 20 seconds
});
const db = new PrismaClient({ adapter });

export default db;
