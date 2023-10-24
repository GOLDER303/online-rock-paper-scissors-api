-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "currentChoice" TEXT NOT NULL DEFAULT 'NONE',
    "previousChoice" TEXT NOT NULL DEFAULT 'NONE',
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "roomInfoId" INTEGER NOT NULL,
    CONSTRAINT "PlayerInfo_roomInfoId_fkey" FOREIGN KEY ("roomInfoId") REFERENCES "RoomInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerInfo" ("connected", "currentChoice", "id", "roomInfoId", "score") SELECT "connected", "currentChoice", "id", "roomInfoId", "score" FROM "PlayerInfo";
DROP TABLE "PlayerInfo";
ALTER TABLE "new_PlayerInfo" RENAME TO "PlayerInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
