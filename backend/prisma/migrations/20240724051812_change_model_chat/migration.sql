/*
  Warnings:

  - You are about to drop the column `role_id` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `chat` table. All the data in the column will be lost.
  - Added the required column `receiver_id` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_role_id_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_user_id_fkey";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "role_id",
DROP COLUMN "user_id",
ADD COLUMN     "receiver_id" INTEGER NOT NULL,
ADD COLUMN     "sender_id" INTEGER NOT NULL;
