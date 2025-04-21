import { PrismaClient, Gender, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { fakerJA } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('Seeding users...');

  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash('admin12345', 10);
  await prisma.user.create({
    data: {
      firstName: '太郎',
      lastName: 'admin',
      username: 'admin太郎',
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

  const hashedPassword = await bcrypt.hash('test12345', 10);
  await prisma.user.create({
    data: {
      firstName: '太郎',
      lastName: 'テスト',
      username: 'テスト太郎',
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
      username: fakerJA.person.fullName(),
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
