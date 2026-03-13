/*
  Warnings:

  - You are about to drop the column `address_id` on the `tbl_enterprise` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `tbl_enterprise_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterprise_id` to the `tbl_enterprise_address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tbl_enterprise` DROP FOREIGN KEY `tbl_enterprise_address_id_fkey`;

-- DropIndex
DROP INDEX `tbl_enterprise_address_id_fkey` ON `tbl_enterprise`;

-- AlterTable
ALTER TABLE `tbl_enterprise` DROP COLUMN `address_id`;

-- AlterTable
ALTER TABLE `tbl_enterprise_address` ADD COLUMN `address_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `enterprise_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `tbl_enterprise_address` ADD CONSTRAINT `tbl_enterprise_address_enterprise_id_fkey` FOREIGN KEY (`enterprise_id`) REFERENCES `tbl_enterprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_enterprise_address` ADD CONSTRAINT `tbl_enterprise_address_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `tbl_address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
