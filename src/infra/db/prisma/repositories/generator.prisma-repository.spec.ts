import { Password } from "../../../../@core/domain/value-objects/password.value-object";
import { generatorFactory } from "../../../../@core/application/factories/generator.factory";
import { TGeneratorInputDTO } from "../../../../@core/application/dto/input/generator.dto.input";
import { GeneratorRepositoryImpl } from "./generator.prisma-repository";

const makeInput = (): TGeneratorInputDTO => ({
  email: "generator.updated@gmail.com",
  password: "12345678",
  name: "Updated Generator",
  phone: {
    ddd: 11,
    ddi: 55,
    number: "961868671",
  },
  address: {
    zipCode: "06449300",
    number: "10",
    complement: "Casa",
  },
  birthDate: new Date("2015-03-25T00:00:00.000Z"),
  document: "47189168877",
});

const makeGenerator = (input = makeInput(), id = "generator-id") => {
  const result = generatorFactory(input);
  const generator = result.value.getValue();
  generator.setId(id);
  generator.getUser().setPassword(Password.create({ password: "hashed-password" }).getValue());
  return generator;
};

const prismaResult = {
  id: "generator-id",
  document: "47189168877",
  birthDate: new Date("2015-03-25T00:00:00.000Z"),
  user_id: "user-id",
  user: {
    id: "user-id",
    email: "generator.updated@gmail.com",
    password: "hashed-password",
    phone: "+55 (11) 961868671",
    name: "Updated Generator",
  },
  tbl_generator_address: [{
    id: "address-link-id",
    number: "10",
    complement: "Casa",
    address: {
      zipCode: "06449300",
    },
  }],
};

describe("GeneratorRepositoryImpl.update", () => {
  const transaction = {
    tbl_generator: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    tbl_user: {
      update: jest.fn(),
    },
    tbl_generator_address: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const prisma = {
    $transaction: jest.fn((callback) => callback(transaction)),
    tbl_generator: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    transaction.tbl_generator.findUnique.mockResolvedValue({ id: "generator-id", user_id: "user-id" });
    prisma.tbl_generator.findUnique.mockResolvedValue(prismaResult);
  });

  it("replaces generator, user, and address data", async () => {
    const repository = new GeneratorRepositoryImpl(prisma as any);

    const result = await repository.update(makeGenerator());

    expect(transaction.tbl_generator.update).toHaveBeenCalledWith({
      where: { id: "generator-id" },
      data: {
        document: "47189168877",
        birthDate: new Date("2015-03-25T00:00:00.000Z"),
      },
    });
    expect(transaction.tbl_user.update).toHaveBeenCalledWith({
      where: { id: "user-id" },
      data: {
        name: "Updated Generator",
        phone: "+55 (11) 961868671",
        email: "generator.updated@gmail.com",
        password: "hashed-password",
      },
    });
    expect(transaction.tbl_generator_address.deleteMany).toHaveBeenCalledWith({
      where: { generator_id: "generator-id" },
    });
    expect(transaction.tbl_generator_address.create).toHaveBeenCalledWith({
      data: {
        generator: {
          connect: { id: "generator-id" },
        },
        number: "10",
        complement: "Casa",
        address: {
          connectOrCreate: {
            where: { zipCode: "06449300" },
            create: { zipCode: "06449300" },
          },
        },
      },
    });
    expect(result.getId()).toBe("generator-id");
  });

  it("returns null when generator does not exist", async () => {
    transaction.tbl_generator.findUnique.mockResolvedValue(null);
    const repository = new GeneratorRepositoryImpl(prisma as any);

    const result = await repository.update(makeGenerator());

    expect(result).toBeNull();
    expect(transaction.tbl_generator.update).not.toHaveBeenCalled();
  });
});
