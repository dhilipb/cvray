import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/* --------- Prisma Configuration --------- */

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  // No throw when unset: `next build` imports this without runtime env; `prisma db push` at startup fails loudly instead
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  // Clear the cache to pick up the new schema if it changed
  // @ts-expect-error - prisma is not defined on globalThis in standard types
  delete globalThis.prisma;
  globalForPrisma.prisma = prisma;
}
