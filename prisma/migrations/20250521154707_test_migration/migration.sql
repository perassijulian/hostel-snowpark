/*
  Warnings:

  - You are about to drop the column `type` on the `Booking` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Accommodation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `accommodationId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('DORM', 'PRIVATE', 'SUITE', 'CABIN', 'TENT', 'OTHER');

-- AlterTable
ALTER TABLE "Accommodation" DROP COLUMN "type",
ADD COLUMN     "type" "AccommodationType" NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "type",
ADD COLUMN     "accommodationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
