/*
  Warnings:

  - You are about to drop the column `document` on the `tbl_enterprise` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tbl_enterprise` table. All the data in the column will be lost.
  - You are about to drop the `tbl_enterprise_address` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `waste_collector_id` to the `tbl_enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tbl_enterprise` DROP FOREIGN KEY `tbl_enterprise_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_enterprise_address` DROP FOREIGN KEY `tbl_enterprise_address_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_enterprise_address` DROP FOREIGN KEY `tbl_enterprise_address_enterprise_id_fkey`;

-- DropIndex
DROP INDEX `tbl_enterprise_document_key` ON `tbl_enterprise`;

-- DropIndex
DROP INDEX `tbl_enterprise_user_id_fkey` ON `tbl_enterprise`;

-- AlterTable
ALTER TABLE `tbl_enterprise` DROP COLUMN `document`,
    DROP COLUMN `user_id`,
    ADD COLUMN `waste_collector_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `tbl_enterprise_address`;

-- CreateTable
CREATE TABLE `tbl_materials` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_materials_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_materials_waste_collector` (
    `id` VARCHAR(191) NOT NULL,
    `waste_collector_id` VARCHAR(191) NOT NULL,
    `materials_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_waste_collector` (
    `id` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `isEnterprise` BOOLEAN NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_waste_collector_document_key`(`document`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_materials_waste_collector` ADD CONSTRAINT `tbl_materials_waste_collector_waste_collector_id_fkey` FOREIGN KEY (`waste_collector_id`) REFERENCES `tbl_waste_collector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_materials_waste_collector` ADD CONSTRAINT `tbl_materials_waste_collector_materials_id_fkey` FOREIGN KEY (`materials_id`) REFERENCES `tbl_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_waste_collector` ADD CONSTRAINT `tbl_waste_collector_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_waste_collector` ADD CONSTRAINT `tbl_waste_collector_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `tbl_address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_enterprise` ADD CONSTRAINT `tbl_enterprise_waste_collector_id_fkey` FOREIGN KEY (`waste_collector_id`) REFERENCES `tbl_waste_collector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
