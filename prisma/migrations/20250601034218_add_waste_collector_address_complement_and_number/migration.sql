-- DropForeignKey
ALTER TABLE `tbl_waste_collector` DROP FOREIGN KEY `tbl_waste_collector_address_id_fkey`;

-- DropIndex
DROP INDEX `tbl_waste_collector_address_id_fkey` ON `tbl_waste_collector`;

-- CreateTable
CREATE TABLE `tbl_waste_collector_address` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,
    `waste_collector_id` VARCHAR(191) NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_waste_collector_address` ADD CONSTRAINT `tbl_waste_collector_address_waste_collector_id_fkey` FOREIGN KEY (`waste_collector_id`) REFERENCES `tbl_waste_collector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_waste_collector_address` ADD CONSTRAINT `tbl_waste_collector_address_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `tbl_address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
