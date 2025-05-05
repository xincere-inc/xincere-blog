import { fakerJA } from '@faker-js/faker';
import { Gender, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('Seeding users...');

  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash('Admin12345@', 10);
  await prisma.user.create({
    data: {
      firstName: '太郎',
      lastName: 'admin',
      email: 'admin@example.com',
      gender: Gender.male,
      role: Role.admin,
      country: 'Japan',
      password: adminPassword,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const hashedPassword = await bcrypt.hash('Test12345@', 10);
  await prisma.user.create({
    data: {
      firstName: '太郎',
      lastName: 'テスト',
      email: 'sample@example.com',
      gender: Gender.male,
      role: Role.user,
      country: 'Japan',
      password: hashedPassword,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const usersData = Array.from({ length: 5 }).map(() => {
    return {
      firstName: fakerJA.person.firstName(),
      lastName: fakerJA.person.lastName(),
      email: fakerJA.internet.email(),
      gender: fakerJA.helpers.arrayElement(Object.values(Gender)),
      role: Role.user,
      country: fakerJA.location.country(),
      password: hashedPassword,
      emailVerified: fakerJA.datatype.boolean(),
      emailVerificationToken: fakerJA.datatype.boolean()
        ? fakerJA.string.uuid()
        : null,
      resetPasswordToken: null,
      resetPasswordMailTime: null,
      createdAt: fakerJA.date.past(),
      updatedAt: fakerJA.date.recent(),
    };
  });

  const result = await prisma.user.createMany({ data: usersData });

  console.log(`Seeded ${result.count} users successfully.`);
}
