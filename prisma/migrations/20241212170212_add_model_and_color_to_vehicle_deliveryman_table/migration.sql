/*
  Warnings:

  - Added the required column `color_id` to the `tbl_vehicle_deliveryman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_id` to the `tbl_vehicle_deliveryman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_vehicle_deliveryman` ADD COLUMN `color_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `model_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_deliveryman` ADD CONSTRAINT `tbl_vehicle_deliveryman_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `tbl_vehicle_model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_vehicle_deliveryman` ADD CONSTRAINT `tbl_vehicle_deliveryman_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `tbl_color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
