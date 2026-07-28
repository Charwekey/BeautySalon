import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Clearing all appointments, notifications, and audit logs...");
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.appointment.deleteMany();
  console.log("✅ ALL BOOKING DATA CLEARED SUCCESSFULLY!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error clearing data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
