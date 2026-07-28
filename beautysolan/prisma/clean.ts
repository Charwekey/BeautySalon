import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Clearing all appointments, customers, reviews, and staff data...\n");

  // 1. Delete all appointments
  const deletedApps = await prisma.appointment.deleteMany();
  console.log(`✅ Deleted ${deletedApps.count} appointments.`);

  // 2. Delete all reviews
  const deletedReviews = await prisma.review.deleteMany();
  console.log(`✅ Deleted ${deletedReviews.count} reviews.`);

  // 3. Delete all staff profiles
  const deletedStaff = await prisma.staff.deleteMany();
  console.log(`✅ Deleted ${deletedStaff.count} staff entries.`);

  // 4. Delete all non-admin users (keep or recreate single admin)
  await prisma.user.deleteMany();
  console.log(`✅ Cleared all customer & staff user accounts.`);

  // 5. Re-create clean Admin account
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      name: "Admin Beauty",
      email: "admin@beautytechnicians.com",
      password: hashedPassword,
      phone: "+233240000001",
      role: "ADMIN",
    },
  });
  console.log("👑 Admin account reset: admin@beautytechnicians.com / password123");

  console.log("\n✨ Database is now completely clean & ready for fresh customer bookings!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Cleanup failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
