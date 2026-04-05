-- CreateTable
CREATE TABLE "tbl_user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_generator" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tbl_generator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_deliveryman" (
    "id" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tbl_deliveryman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_type" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_brand" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_model" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_color" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "tbl_color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "brand_id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_color" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "color_id" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_vehicle_model" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_vehicle_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_deliveryman" (
    "id" TEXT NOT NULL,
    "deliveryman_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "color_id" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicle_deliveryman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tbl_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_materials_waste_collector" (
    "id" TEXT NOT NULL,
    "waste_collector_id" TEXT NOT NULL,
    "materials_id" TEXT NOT NULL,

    CONSTRAINT "tbl_materials_waste_collector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_waste_collector" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "isEnterprise" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tbl_waste_collector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_address" (
    "id" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "tbl_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_waste_collector_address" (
    "id" TEXT NOT NULL,
    "number" TEXT,
    "complement" TEXT,
    "waste_collector_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "tbl_waste_collector_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_enterprise" (
    "id" TEXT NOT NULL,
    "commercialName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "waste_collector_id" TEXT NOT NULL,

    CONSTRAINT "tbl_enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_generator_address" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "generator_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "tbl_generator_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_collection_status" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tbl_collection_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_collection" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "waste_collector_id" TEXT NOT NULL,
    "generator_id" TEXT NOT NULL,
    "deliveryman_id" TEXT,
    "status_id" TEXT NOT NULL,
    "photo_proof" TEXT,
    "co2_saved" DOUBLE PRECISION,

    CONSTRAINT "tbl_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_collection_item" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "collection_id" TEXT NOT NULL,
    "materials_id" TEXT NOT NULL,

    CONSTRAINT "tbl_collection_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_email_key" ON "tbl_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_phone_key" ON "tbl_user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vehicle_type_type_key" ON "tbl_vehicle_type"("type");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vehicle_brand_brand_key" ON "tbl_vehicle_brand"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vehicle_model_model_key" ON "tbl_vehicle_model"("model");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_color_color_key" ON "tbl_color"("color");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_materials_name_key" ON "tbl_materials"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_waste_collector_document_key" ON "tbl_waste_collector"("document");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_address_zipCode_key" ON "tbl_address"("zipCode");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_collection_status_status_key" ON "tbl_collection_status"("status");

-- AddForeignKey
ALTER TABLE "tbl_generator" ADD CONSTRAINT "tbl_generator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_deliveryman" ADD CONSTRAINT "tbl_deliveryman_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle" ADD CONSTRAINT "tbl_vehicle_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "tbl_vehicle_brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle" ADD CONSTRAINT "tbl_vehicle_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "tbl_vehicle_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_color" ADD CONSTRAINT "tbl_vehicle_color_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "tbl_vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_color" ADD CONSTRAINT "tbl_vehicle_color_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "tbl_color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_vehicle_model" ADD CONSTRAINT "tbl_vehicle_vehicle_model_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "tbl_vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_vehicle_model" ADD CONSTRAINT "tbl_vehicle_vehicle_model_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "tbl_vehicle_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_deliveryman" ADD CONSTRAINT "tbl_vehicle_deliveryman_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "tbl_deliveryman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_deliveryman" ADD CONSTRAINT "tbl_vehicle_deliveryman_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "tbl_vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_deliveryman" ADD CONSTRAINT "tbl_vehicle_deliveryman_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "tbl_vehicle_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_deliveryman" ADD CONSTRAINT "tbl_vehicle_deliveryman_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "tbl_color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_materials_waste_collector" ADD CONSTRAINT "tbl_materials_waste_collector_waste_collector_id_fkey" FOREIGN KEY ("waste_collector_id") REFERENCES "tbl_waste_collector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_materials_waste_collector" ADD CONSTRAINT "tbl_materials_waste_collector_materials_id_fkey" FOREIGN KEY ("materials_id") REFERENCES "tbl_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_waste_collector" ADD CONSTRAINT "tbl_waste_collector_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_waste_collector_address" ADD CONSTRAINT "tbl_waste_collector_address_waste_collector_id_fkey" FOREIGN KEY ("waste_collector_id") REFERENCES "tbl_waste_collector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_waste_collector_address" ADD CONSTRAINT "tbl_waste_collector_address_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "tbl_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_enterprise" ADD CONSTRAINT "tbl_enterprise_waste_collector_id_fkey" FOREIGN KEY ("waste_collector_id") REFERENCES "tbl_waste_collector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_generator_address" ADD CONSTRAINT "tbl_generator_address_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "tbl_generator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_generator_address" ADD CONSTRAINT "tbl_generator_address_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "tbl_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_collection" ADD CONSTRAINT "tbl_collection_waste_collector_id_fkey" FOREIGN KEY ("waste_collector_id") REFERENCES "tbl_waste_collector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_collection" ADD CONSTRAINT "tbl_collection_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "tbl_generator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_collection" ADD CONSTRAINT "tbl_collection_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "tbl_deliveryman"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_collection" ADD CONSTRAINT "tbl_collection_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "tbl_collection_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_collection_item" ADD CONSTRAINT "tbl_collection_item_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "tbl_collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_collection_item" ADD CONSTRAINT "tbl_collection_item_materials_id_fkey" FOREIGN KEY ("materials_id") REFERENCES "tbl_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
