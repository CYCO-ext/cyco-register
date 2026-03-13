-- CreateTable
CREATE TABLE `tbl_deliveryman` (
    `id` VARCHAR(191) NOT NULL,
    `licenseNumber` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle_type` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_vehicle_type_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle_brand` (
    `id` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_vehicle_brand_brand_key`(`brand`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle_model` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_vehicle_model_model_key`(`model`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_color` (
    `id` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_color_color_key`(`color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `brand_id` VARCHAR(191) NOT NULL,
    `type_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle_color` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `color_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle_vehicle_model` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `model_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_vehicle_deliveryman` (
    `id` VARCHAR(191) NOT NULL,
    `deliveryman_id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `plate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_deliveryman` ADD CONSTRAINT `tbl_deliveryman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle` ADD CONSTRAINT `tbl_vehicle_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `tbl_vehicle_brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle` ADD CONSTRAINT `tbl_vehicle_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `tbl_vehicle_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_color` ADD CONSTRAINT `tbl_vehicle_color_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `tbl_vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_color` ADD CONSTRAINT `tbl_vehicle_color_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `tbl_color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_vehicle_model` ADD CONSTRAINT `tbl_vehicle_vehicle_model_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `tbl_vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_vehicle_model` ADD CONSTRAINT `tbl_vehicle_vehicle_model_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `tbl_vehicle_model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_deliveryman` ADD CONSTRAINT `tbl_vehicle_deliveryman_deliveryman_id_fkey` FOREIGN KEY (`deliveryman_id`) REFERENCES `tbl_deliveryman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_deliveryman` ADD CONSTRAINT `tbl_vehicle_deliveryman_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `tbl_vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
