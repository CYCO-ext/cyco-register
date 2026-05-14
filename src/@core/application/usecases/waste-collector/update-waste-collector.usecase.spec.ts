import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Material } from "../../../domain/value-objects/material.value-object";
import { Password } from "../../../domain/value-objects/password.value-object";
import { wasteCollectorFactory } from "../../factories/waste-collector.factory";
import { TWasteCollectorInputDTO } from "../../dto/input/waste-collector.dto.input";
import { UpdateWasteCollectorUsecase } from "./update-waste-collector.usecase";

const makeInput = (): TWasteCollectorInputDTO => ({
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
  isEnterprise: false,
  materials: ["Glass"],
});

const makeWasteCollector = (input = makeInput(), id = "collector-id") => {
  const result = wasteCollectorFactory(input);
  const wasteCollector = result.value.getValue();
  wasteCollector.setId(id);
  wasteCollector.getUser().setPassword(Password.create({ password: "hashed-password" }).getValue());
  return wasteCollector;
};

describe("UpdateWasteCollectorUsecase", () => {
  const repository = {
    update: jest.fn(),
  };
  const materialRepository = {
    findByName: jest.fn(),
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

  const makeUsecase = () => new UpdateWasteCollectorUsecase(
    repository as any,
    materialRepository as any,
    passwordCryptography as any,
    validator as any,
    {},
    eventProducer as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.KAFKA_COLLECTOR_UPDATED_TOPIC;
    validator.validate.mockReturnValue({ isValid: true });
    materialRepository.findByName.mockResolvedValue(Material.create({ name: "Glass" }).getValue());
    passwordCryptography.hash.mockResolvedValue("hashed-password");
    repository.update.mockResolvedValue(makeWasteCollector());
    eventProducer.publish.mockResolvedValue(undefined);
  });

  it("updates a waste collector with a full payload and publishes an update event", async () => {
    const input = makeInput();

    const output = await makeUsecase().execute("collector-id", input);

    expect(passwordCryptography.hash).toHaveBeenCalledWith(input.password);
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update.mock.calls[0][0].getId()).toBe("collector-id");
    expect(repository.update.mock.calls[0][0].getUser().getPassword().getPassword()).toBe("hashed-password");
    expect(eventProducer.publish).toHaveBeenCalledWith("collector-update", expect.objectContaining({
      eventType: "COLLECTOR_UPDATED",
      collectorId: "collector-id",
      name: "Updated Collector",
      acceptedMaterialIds: ["Glass"],
      acceptanceRate: 1,
    }));
    expect(output).toEqual(expect.objectContaining({
      id: "collector-id",
      email: input.email,
      document: input.document,
      materials: ["Glass"],
    }));
  });

  it("uses the configured collector updated topic", async () => {
    process.env.KAFKA_COLLECTOR_UPDATED_TOPIC = "collector-updated-events";

    await makeUsecase().execute("collector-id", makeInput());

    expect(eventProducer.publish).toHaveBeenCalledWith(
      "collector-updated-events",
      expect.objectContaining({ eventType: "COLLECTOR_UPDATED" }),
    );
  });

  it("rejects invalid full payloads before updating", async () => {
    validator.validate.mockReturnValue({ isValid: false, errorsResult: "validation-error" });

    await expect(makeUsecase().execute("collector-id", makeInput())).rejects.toThrow(UnprocessableEntityException);

    expect(repository.update).not.toHaveBeenCalled();
    expect(eventProducer.publish).not.toHaveBeenCalled();
  });

  it("rejects unknown materials before updating", async () => {
    materialRepository.findByName.mockResolvedValue(null);

    await expect(makeUsecase().execute("collector-id", makeInput())).rejects.toThrow(UnprocessableEntityException);

    expect(repository.update).not.toHaveBeenCalled();
    expect(eventProducer.publish).not.toHaveBeenCalled();
  });

  it("throws not found and does not publish when the collector is missing", async () => {
    repository.update.mockResolvedValue(null);

    await expect(makeUsecase().execute("missing-id", makeInput())).rejects.toThrow(NotFoundException);

    expect(eventProducer.publish).not.toHaveBeenCalled();
  });

  it("returns the updated collector when event publication fails", async () => {
    eventProducer.publish.mockRejectedValue(new Error("kafka unavailable"));

    const output = await makeUsecase().execute("collector-id", makeInput());

    expect(output.id).toBe("collector-id");
  });
});
