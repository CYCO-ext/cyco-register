import { Password } from "../../../../@core/domain/value-objects/password.value-object";
import { wasteCollectorFactory } from "../../../../@core/application/factories/waste-collector.factory";
import { TWasteCollectorInputDTO } from "../../../../@core/application/dto/input/waste-collector.dto.input";
import { WasteCollectorRepositoryImpl } from "./waste-collector.prisma-repository";

const makeInput = (isEnterprise = true): TWasteCollectorInputDTO => ({
  email: "collector.updated@gmail.com",
  password: "12345678",
  name: "Updated Collector",
  phone: {
    ddd: 11,
    ddi: 55,
    number: "961868671",
  },
  address: {
    zipCode: "06449300",
    number: "10",
    complement: "A",
  },
  document: "16543092068",
  isEnterprise,
  materials: ["Glass"],
  enterprise: isEnterprise ? {
    companyName: "Updated Company",
  } : undefined,
});

const makeWasteCollector = (input = makeInput(), id = "collector-id") => {
  const result = wasteCollectorFactory(input);
  const wasteCollector = result.value.getValue();
  wasteCollector.setId(id);
  wasteCollector.getUser().setPassword(Password.create({ password: "hashed-password" }).getValue());
  return wasteCollector;
};

const prismaResult = {
  id: "collector-id",
  document: "16543092068",
  isEnterprise: true,
  user_id: "user-id",
  user: {
    id: "user-id",
    email: "collector.updated@gmail.com",
    password: "hashed-password",
    phone: "+55 (11) 961868671",
    name: "Updated Collector",
    tbl_generator: [],
    tbl_waste_collector: [],
  },
  tbl_waste_collector_address: [{
    number: "10",
    complement: "A",
    address: {
      zipCode: "06449300",
    },
  }],
  tbl_enterprise: [{
    commercialName: "Updated Collector",
    companyName: "Updated Company",
  }],
  tbl_materials_waste_collector: [{
    materials: {
      name: "Glass",
    },
  }],
};

describe("WasteCollectorRepositoryImpl.update", () => {
  const transaction = {
    tbl_waste_collector: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    tbl_user: {
      update: jest.fn(),
    },
    tbl_waste_collector_address: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    tbl_enterprise: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    tbl_materials_waste_collector: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  };

  const prisma = {
    $transaction: jest.fn((callback) => callback(transaction)),
    tbl_materials: {
      findMany: jest.fn(),
    },
    tbl_waste_collector: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    transaction.tbl_waste_collector.findUnique
      .mockResolvedValueOnce({ id: "collector-id", user_id: "user-id" });
    prisma.tbl_materials.findMany.mockResolvedValue([{ id: "material-id", name: "Glass" }]);
    prisma.tbl_waste_collector.findUnique.mockResolvedValue(prismaResult);
  });

  it("replaces collector, user, address, enterprise, and materials data", async () => {
    const repository = new WasteCollectorRepositoryImpl(prisma as any);

    const result = await repository.update(makeWasteCollector());

    expect(transaction.tbl_waste_collector.update).toHaveBeenCalledWith({
      where: { id: "collector-id" },
      data: {
        document: "16543092068",
        isEnterprise: true,
      },
    });
    expect(transaction.tbl_user.update).toHaveBeenCalledWith({
      where: { id: "user-id" },
      data: {
        name: "Updated Collector",
        phone: "+55 (11) 961868671",
        email: "collector.updated@gmail.com",
        password: "hashed-password",
      },
    });
    expect(transaction.tbl_waste_collector_address.deleteMany).toHaveBeenCalledWith({
      where: { waste_collector_id: "collector-id" },
    });
    expect(transaction.tbl_waste_collector_address.create).toHaveBeenCalledWith({
      data: {
        waste_collector: {
          connect: { id: "collector-id" },
        },
        number: "10",
        complement: "A",
        address: {
          connectOrCreate: {
            where: { zipCode: "06449300" },
            create: { zipCode: "06449300" },
          },
        },
      },
    });
    expect(transaction.tbl_enterprise.deleteMany).toHaveBeenCalledWith({
      where: { waste_collector_id: "collector-id" },
    });
    expect(transaction.tbl_enterprise.create).toHaveBeenCalledWith({
      data: {
        waste_collector_id: "collector-id",
        commercialName: "Updated Collector",
        companyName: "Updated Company",
      },
    });
    expect(transaction.tbl_materials_waste_collector.deleteMany).toHaveBeenCalledWith({
      where: { waste_collector_id: "collector-id" },
    });
    expect(transaction.tbl_materials_waste_collector.createMany).toHaveBeenCalledWith({
      data: [{
        waste_collector_id: "collector-id",
        materials_id: "material-id",
      }],
    });
    expect(result.getId()).toBe("collector-id");
  });

  it("removes enterprise data when collector is no longer enterprise", async () => {
    transaction.tbl_waste_collector.findUnique
      .mockReset()
      .mockResolvedValueOnce({ id: "collector-id", user_id: "user-id" });
    prisma.tbl_waste_collector.findUnique.mockResolvedValue({ ...prismaResult, isEnterprise: false, tbl_enterprise: [] });
    const repository = new WasteCollectorRepositoryImpl(prisma as any);

    await repository.update(makeWasteCollector(makeInput(false)));

    expect(transaction.tbl_enterprise.deleteMany).toHaveBeenCalledWith({
      where: { waste_collector_id: "collector-id" },
    });
    expect(transaction.tbl_enterprise.create).not.toHaveBeenCalled();
  });

  it("returns null when the collector does not exist", async () => {
    transaction.tbl_waste_collector.findUnique.mockReset().mockResolvedValueOnce(null);
    const repository = new WasteCollectorRepositoryImpl(prisma as any);

    const result = await repository.update(makeWasteCollector());

    expect(result).toBeNull();
    expect(transaction.tbl_waste_collector.update).not.toHaveBeenCalled();
  });
});
