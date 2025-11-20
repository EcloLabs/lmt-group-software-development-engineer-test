import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (existingUser) {
    console.log('Default user already exists.');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Administrateur',
    },
  });

  console.log('Default user created:', user.email);
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
