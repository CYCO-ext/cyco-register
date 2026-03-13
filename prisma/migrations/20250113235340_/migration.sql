-- CreateTable
CREATE TABLE `tbl_generator_address` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,
    `generator_id` VARCHAR(191) NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_generator_address` ADD CONSTRAINT `tbl_generator_address_generator_id_fkey` FOREIGN KEY (`generator_id`) REFERENCES `tbl_generator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_generator_address` ADD CONSTRAINT `tbl_generator_address_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `tbl_address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
