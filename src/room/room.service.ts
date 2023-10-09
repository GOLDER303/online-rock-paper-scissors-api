import { Injectable } from "@nestjs/common";
import { RoomInfo } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(): Promise<RoomInfo> {
    return await this.prisma.roomInfo.create({
      data: {
        players: {
          create: [{}, {}],
        },
      },
    });
  }

  async getRoomInfo(roomId: number): Promise<RoomInfo> {
    return await this.prisma.roomInfo.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        players: {
          select: {
            id: true,
            currentChoice: true,
            score: true,
            connected: true,
          },
        },
      },
    });
  }

  async joinRoom(roomId: number): Promise<number> {
    const roomInfo = await this.prisma.roomInfo.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        players: { select: { id: true }, where: { connected: false } },
      },
    });

    const connectedPlayers = roomInfo.players;

    if (connectedPlayers.length == 0) {
      return -1;
    }

    await this.prisma.playerInfo.update({
      where: { id: connectedPlayers[0].id },
      data: { connected: true },
    });

    return connectedPlayers[0].id;
  }

  async leaveRoom(playerId: number) {
    await this.prisma.playerInfo.update({
      where: { id: playerId },
      data: { connected: false },
    });
  }
}
