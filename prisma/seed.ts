import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma";
import * as bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const operatorPassword = await bcrypt.hash("operator123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@paygoat.com" },
    update: {},
    create: {
      email: "admin@paygoat.com",
      password: adminPassword,
      role: "admin",
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: "operator@paygoat.com" },
    update: {},
    create: {
      email: "operator@paygoat.com",
      password: operatorPassword,
      role: "operator",
    },
  });

  console.log("✅ Seeded users:");
  console.log("   Admin:", admin.email, "(password: admin123)");
  console.log("   Operator:", operator.email, "(password: operator123)");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
