-- CreateTable
CREATE TABLE `tbl_user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_user_email_key`(`email`),
    UNIQUE INDEX `tbl_user_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_generator` (
    `id` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_generator` ADD CONSTRAINT `tbl_generator_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
