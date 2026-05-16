import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/* --------- Prisma Configuration --------- */

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  const adapter = new PrismaLibSql({
    url: url,
  });
  return new PrismaClient({ adapter, log: ["query"] });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  // Clear the cache to pick up the new schema if it changed
  // @ts-ignore
  delete globalThis.prisma;
  globalForPrisma.prisma = prisma;
}
