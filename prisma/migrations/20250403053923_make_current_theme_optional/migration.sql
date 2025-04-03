/*
  Warnings:

  - Added the required column `currency` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSettings" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "currentTheme" TEXT,
    "currency" TEXT NOT NULL
);
INSERT INTO "new_UserSettings" ("currentTheme", "userId") SELECT "currentTheme", "userId" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
