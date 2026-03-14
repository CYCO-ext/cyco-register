-- CreateTable
CREATE TABLE `tbl_collection_status` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_collection_status_status_key`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_collection` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `waste_collector_id` VARCHAR(191) NOT NULL,
    `generator_id` VARCHAR(191) NOT NULL,
    `deliveryman_id` VARCHAR(191) NULL,
    `status_id` VARCHAR(191) NOT NULL,
    `photo_proof` VARCHAR(191) NULL,
    `co2_saved` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_collection_item` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `collection_id` VARCHAR(191) NOT NULL,
    `materials_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_collection` ADD CONSTRAINT `tbl_collection_waste_collector_id_fkey` FOREIGN KEY (`waste_collector_id`) REFERENCES `tbl_waste_collector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_collection` ADD CONSTRAINT `tbl_collection_generator_id_fkey` FOREIGN KEY (`generator_id`) REFERENCES `tbl_generator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_collection` ADD CONSTRAINT `tbl_collection_deliveryman_id_fkey` FOREIGN KEY (`deliveryman_id`) REFERENCES `tbl_deliveryman`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_collection` ADD CONSTRAINT `tbl_collection_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `tbl_collection_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_collection_item` ADD CONSTRAINT `tbl_collection_item_collection_id_fkey` FOREIGN KEY (`collection_id`) REFERENCES `tbl_collection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_collection_item` ADD CONSTRAINT `tbl_collection_item_materials_id_fkey` FOREIGN KEY (`materials_id`) REFERENCES `tbl_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
