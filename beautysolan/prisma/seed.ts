import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Beauty Technicians database...\n");

  // ─── Clean existing data ───
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // ─── Create Users ───
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Beauty",
      email: "admin@beautytechnicians.com",
      password: hashedPassword,
      phone: "+233240000001",
      role: "SUPER_ADMIN",
    },
  });

  const staffUser1 = await prisma.user.create({
    data: {
      name: "Akua Stylist",
      email: "akua@beautytechnicians.com",
      password: hashedPassword,
      phone: "+233240000002",
      role: "STYLIST",
    },
  });

  const staffUser2 = await prisma.user.create({
    data: {
      name: "Yaa Braider",
      email: "yaa@beautytechnicians.com",
      password: hashedPassword,
      phone: "+233240000003",
      role: "STYLIST",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Ama Mensah",
      email: "ama@gmail.com",
      password: hashedPassword,
      phone: "+233240000010",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Kwame Asante",
      email: "kwame@gmail.com",
      password: hashedPassword,
      phone: "+233240000011",
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created (admin, 2 staff, 2 customers)");

  // ─── Create Staff Profiles ───
  const staff1 = await prisma.staff.create({
    data: {
      name: "Akua Stylist",
      specialization: "Hair Styling & Coloring",
      bio: "Expert hair stylist with over 8 years of experience in luxury hair transformations.",
      availability: JSON.stringify({
        monday: ["9:00", "17:00"],
        tuesday: ["9:00", "17:00"],
        wednesday: ["9:00", "17:00"],
        thursday: ["9:00", "17:00"],
        friday: ["9:00", "17:00"],
        saturday: ["10:00", "15:00"],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1595959183082-7b570b7e1e19?w=400&q=80",
      userId: staffUser1.id,
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      name: "Yaa Braider",
      specialization: "Braiding & Wig Installation",
      bio: "Master braider and wig specialist known for intricate protective styles and seamless installations.",
      availability: JSON.stringify({
        monday: ["9:00", "18:00"],
        tuesday: ["9:00", "18:00"],
        wednesday: ["9:00", "18:00"],
        thursday: ["9:00", "18:00"],
        friday: ["9:00", "18:00"],
        saturday: ["10:00", "16:00"],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80",
      userId: staffUser2.id,
    },
  });

  console.log("✅ Staff profiles created");

  // ─── Create Services ───
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Luxury Hair Styling",
        description:
          "Complete hair styling session including wash, blow-dry, and styling. Perfect for any occasion.",
        price: 150.0,
        duration: 90,
        category: "Hair",
        imageUrl:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
        featured: true,
      },
    }),
    prisma.service.create({
      data: {
        name: "Knotless & Box Braids",
        description:
          "Classic box braids with premium extension hair. Includes hair washing and scalp conditioning treatment.",
        price: 250.0,
        duration: 180,
        category: "Hair",
        imageUrl:
          "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
        featured: true,
      },
    }),
    prisma.service.create({
      data: {
        name: "Melted Lace Wig Install",
        description:
          "Professional wig installation with lace front customization, bleaching, and invisible scalp melt.",
        price: 300.0,
        duration: 120,
        category: "Hair",
        imageUrl:
          "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
        featured: true,
      },
    }),
    prisma.service.create({
      data: {
        name: "Revitalizing Hair Treatment",
        description:
          "Deep steam conditioning treatment to restore dry hair, promote growth, and add shine.",
        price: 120.0,
        duration: 60,
        category: "Hair",
        imageUrl:
          "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
        featured: false,
      },
    }),
    prisma.service.create({
      data: {
        name: "Custom Gel & Acrylic Nails",
        description:
          "Premium gel nail application with custom nail art designs. Long-lasting shine.",
        price: 100.0,
        duration: 75,
        category: "Nails",
        imageUrl:
          "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
        featured: true,
      },
    }),
    prisma.service.create({
      data: {
        name: "Glow Facial & Grooming",
        description:
          "Complete facial grooming including deep cleanse, exfoliation, mask, and eyebrow sculpting.",
        price: 180.0,
        duration: 90,
        category: "Grooming",
        imageUrl:
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
        featured: true,
      },
    }),
  ]);

  console.log(`✅ ${services.length} services created`);

  // ─── Create Sample Appointments ───
  const now = new Date();
  await Promise.all([
    prisma.appointment.create({
      data: {
        bookingCode: "BK-001",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        time: "10:00 AM",
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "PAY_AT_SALON",
        notes: "First time visit, excited for a new look!",
        totalPrice: 250.0,
        customerId: customer1.id,
        serviceId: services[1].id,
        staffId: staff2.id,
      },
    }),
    prisma.appointment.create({
      data: {
        bookingCode: "BK-002",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        time: "02:00 PM",
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "PAY_NOW_CARD",
        receiptNumber: "PAY-20260031",
        notes: "Lace front wig, honey blonde color",
        totalPrice: 300.0,
        customerId: customer2.id,
        serviceId: services[2].id,
        staffId: staff2.id,
      },
    }),
  ]);

  console.log("✅ Initial sample appointments created");
  console.log("\n🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
