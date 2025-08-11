/* eslint-disable */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const citiesData = [
    { name: 'Paris', country: 'France', costIndex: 85.5, popularityScore: 95 },
    { name: 'Tokyo', country: 'Japan', costIndex: 90.2, popularityScore: 98 },
    { name: 'Bangkok', country: 'Thailand', costIndex: 50.4, popularityScore: 90 },
    { name: 'New York', country: 'USA', costIndex: 100.0, popularityScore: 97 },
  ];

  for (const c of citiesData) {
    await prisma.city.upsert({
      where: { name_country: { name: c.name, country: c.country } },
      update: c,
      create: c,
    }).catch(async () => {
      // Fallback if composite unique not present; ignore
      const exists = await prisma.city.findFirst({ where: { name: c.name, country: c.country } });
      if (!exists) await prisma.city.create({ data: c });
    });
  }

  const paris = await prisma.city.findFirst({ where: { name: 'Paris' } });
  const tokyo = await prisma.city.findFirst({ where: { name: 'Tokyo' } });

  const activitiesData = [
    { cityId: paris.id, name: 'Louvre Museum', type: 'Sightseeing', cost: 25.00, duration: 180, description: 'Explore world-famous art.', imageUrl: 'https://example.com/louvre.jpg' },
    { cityId: paris.id, name: 'Eiffel Tower', type: 'Sightseeing', cost: 30.00, duration: 120, description: 'Iconic tower visit.', imageUrl: 'https://example.com/eiffel.jpg' },
    { cityId: tokyo.id, name: 'Sushi Making Class', type: 'Food', cost: 45.00, duration: 150, description: 'Learn to make sushi.', imageUrl: 'https://example.com/sushi.jpg' },
  ];

  for (const a of activitiesData) {
    await prisma.activity.create({ data: a }).catch(() => {});
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


