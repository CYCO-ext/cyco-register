import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Password } from "../../../domain/value-objects/password.value-object";
import { TGeneratorInputDTO } from "../../dto/input/generator.dto.input";
import { generatorFactory } from "../../factories/generator.factory";
import { UpdateGeneratorUsecase } from "./update-generator.usecase";

const makeInput = (address = {
  zipCode: "06449300",
  number: "10",
  complement: "Casa",
}): TGeneratorInputDTO => ({
  email: "generator.updated@gmail.com",
  password: "12345678",
  name: "Updated Generator",
  phone: {
    ddd: 11,
    ddi: 55,
    number: "961868671",
  },
  address,
  birthDate: new Date("2015-03-25T00:00:00.000Z"),
  document: "47189168877",
});

const makeGenerator = (input = makeInput(), id = "generator-id") => {
  const result = generatorFactory(input);
  const generator = result.value.getValue();
  generator.setId(id);
  generator.getUser().setPassword(Password.create({ password: "hashed-password" }).getValue());
  generator.getAddress()[0].setId("address-link-id");
  return generator;
};

describe("UpdateGeneratorUsecase", () => {
  const repository = {
    findById: jest.fn(),
    update: jest.fn(),
  };
  const passwordCryptography = {
    hash: jest.fn(),
  };
  const validator = {
    validate: jest.fn(),
  };
  const eventProducer = {
    publish: jest.fn(),
  };

  const makeUsecase = () => new UpdateGeneratorUsecase(
    repository as any,
    passwordCryptography as any,
    validator as any,
    {},
    eventProducer as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.KAFKA_ADDRESSES_TOPIC;
    validator.validate.mockReturnValue({ isValid: true });
    passwordCryptography.hash.mockResolvedValue("hashed-password");
    repository.findById.mockResolvedValue(makeGenerator(makeInput({
      zipCode: "06449300",
      number: "10",
      complement: "Casa",
    })));
    repository.update.mockResolvedValue(makeGenerator());
    eventProducer.publish.mockResolvedValue(undefined);
  });

  it("updates a generator and publishes address sync when address changes", async () => {
    const input = makeInput({
      zipCode: "06449301",
      number: "11",
      complement: "Apto",
    });
    repository.update.mockResolvedValue(makeGenerator(input));

    const output = await makeUsecase().execute("generator-id", input);

    expect(repository.findById).toHaveBeenCalledWith("generator-id");
    expect(passwordCryptography.hash).toHaveBeenCalledWith(input.password);
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update.mock.calls[0][0].getId()).toBe("generator-id");
    expect(repository.update.mock.calls[0][0].getUser().getPassword().getPassword()).toBe("hashed-password");
    expect(eventProducer.publish).toHaveBeenCalledWith("addresses-sync", {
      id: "address-link-id",
      zipCode: "06449301",
      number: "11",
      complement: "Apto",
    });
    expect(output).toEqual(expect.objectContaining({
      id: "generator-id",
      email: input.email,
      document: input.document,
    }));
  });

  it("does not publish address sync when address is unchanged", async () => {
    const input = makeInput({
      zipCode: "06449300",
      number: "10",
      complement: "Casa",
    });
    repository.update.mockResolvedValue(makeGenerator(input));

    await makeUsecase().execute("generator-id", input);

    expect(eventProducer.publish).not.toHaveBeenCalled();
  });

  it("uses the configured address topic when address changes", async () => {
    process.env.KAFKA_ADDRESSES_TOPIC = "addresses-updated";
    const input = makeInput({ zipCode: "06449302", number: "20", complement: "Casa" });
    repository.update.mockResolvedValue(makeGenerator(input));

    await makeUsecase().execute("generator-id", input);

    expect(eventProducer.publish).toHaveBeenCalledWith(
      "addresses-updated",
      expect.objectContaining({ zipCode: "06449302" }),
    );
  });

  it("rejects invalid full payloads before loading the current generator", async () => {
    validator.validate.mockReturnValue({ isValid: false, errorsResult: "validation-error" });

    await expect(makeUsecase().execute("generator-id", makeInput())).rejects.toThrow(UnprocessableEntityException);

    expect(repository.findById).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("throws not found and does not publish when generator is missing", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(makeUsecase().execute("missing-id", makeInput())).rejects.toThrow(NotFoundException);

    expect(repository.update).not.toHaveBeenCalled();
    expect(eventProducer.publish).not.toHaveBeenCalled();
  });

  it("returns the updated generator when address publishing fails", async () => {
    const input = makeInput({ zipCode: "06449303", number: "30", complement: "Casa" });
    repository.update.mockResolvedValue(makeGenerator(input));
    eventProducer.publish.mockRejectedValue(new Error("kafka unavailable"));

    const output = await makeUsecase().execute("generator-id", input);

    expect(output.id).toBe("generator-id");
  });
});
