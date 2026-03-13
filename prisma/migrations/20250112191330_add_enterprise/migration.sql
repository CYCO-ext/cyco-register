-- CreateTable
CREATE TABLE `tbl_address` (
    `id` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_enterprise_address` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_enterprise` (
    `id` VARCHAR(191) NOT NULL,
    `commercialName` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_enterprise` ADD CONSTRAINT `tbl_enterprise_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `tbl_enterprise_address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_enterprise` ADD CONSTRAINT `tbl_enterprise_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
