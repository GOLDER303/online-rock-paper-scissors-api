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

  async getRoom(roomId: number): Promise<RoomInfo> {
    return await this.prisma.roomInfo.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        players: { select: { currentChoice: true, score: true } },
      },
    });
  }
}
