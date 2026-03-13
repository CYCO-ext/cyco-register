/*
  Warnings:

  - A unique constraint covering the columns `[zipCode]` on the table `tbl_address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tbl_address_zipCode_key` ON `tbl_address`(`zipCode`);
