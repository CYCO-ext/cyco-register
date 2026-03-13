/*
  Warnings:

  - You are about to drop the column `modelName` on the `tbl_enterprise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `tbl_enterprise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyName` to the `tbl_enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_enterprise` DROP COLUMN `modelName`,
    ADD COLUMN `companyName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tbl_enterprise_document_key` ON `tbl_enterprise`(`document`);
