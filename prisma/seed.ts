import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create vehicle types
  const carType = await prisma.tbl_vehicle_type.upsert({
    where: { type: 'Car' },
    update: {},
    create: { type: 'Car' },
  });

  const motorcycleType = await prisma.tbl_vehicle_type.upsert({
    where: { type: 'Motorcycle' },
    update: {},
    create: { type: 'Motorcycle' },
  });

  // Create vehicle brands
  const toyotaBrand = await prisma.tbl_vehicle_brand.upsert({
    where: { brand: 'Toyota' },
    update: {},
    create: { brand: 'Toyota' },
  });

  const hondaBrand = await prisma.tbl_vehicle_brand.upsert({
    where: { brand: 'Honda' },
    update: {},
    create: { brand: 'Honda' },
  });

  // Create vehicle models
  const corollaModel = await prisma.tbl_vehicle_model.upsert({
    where: { model: 'Corolla' },
    update: {},
    create: { model: 'Corolla' },
  });

  const civicModel = await prisma.tbl_vehicle_model.upsert({
    where: { model: 'Civic' },
    update: {},
    create: { model: 'Civic' },
  });

  // Create colors
  const redColor = await prisma.tbl_color.upsert({
    where: { color: 'Red' },
    update: {},
    create: { color: 'Red' },
  });

  const blueColor = await prisma.tbl_color.upsert({
    where: { color: 'Blue' },
    update: {},
    create: { color: 'Blue' },
  });

  // Create vehicles
  const vehicle1 = await prisma.tbl_vehicle.create({
    data: {
      year: 2022,
      brand_id: toyotaBrand.id,
      type_id: carType.id,
      tbl_vehicle_color: {
        create: {
          color_id: redColor.id,
        },
      },
      tbl_vehicle_vehicle_model: {
        create: {
          model_id: corollaModel.id,
        },
      },
    },
  });

  const vehicle2 = await prisma.tbl_vehicle.create({
    data: {
      year: 2023,
      brand_id: hondaBrand.id,
      type_id: motorcycleType.id,
      tbl_vehicle_color: {
        create: {
          color_id: blueColor.id,
        },
      },
      tbl_vehicle_vehicle_model: {
        create: {
          model_id: civicModel.id,
        },
      },
    },
  });

  const material1 = await prisma.tbl_materials.upsert({
    where: { name: 'Plastic' },
    update: {},
    create: { name: 'Plastic' },
  });
  const material2 = await prisma.tbl_materials.upsert({
    where: { name: 'Metal' },
    update: {},
    create: { name: 'Metal' },
  });
  const material3 = await prisma.tbl_materials.upsert({
    where: { name: 'Glass' },
    update: {},
    create: { name: 'Glass' },
  });

  console.log('Seed completed:', { vehicle1, vehicle2, material1, material2, material3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
