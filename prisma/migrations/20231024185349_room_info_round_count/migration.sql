-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "round" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_RoomInfo" ("id") SELECT "id" FROM "RoomInfo";
DROP TABLE "RoomInfo";
ALTER TABLE "new_RoomInfo" RENAME TO "RoomInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
