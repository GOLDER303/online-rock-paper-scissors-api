import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PlayerChoice } from "src/types/player-choice.type";
import { PlayerIntoDTO } from "./dtos/player-info.dto";
import { RoomCreateResponseDTO } from "./dtos/room-create-response.dto";
import { RoomInfoDTO } from "./dtos/room-info.dto";

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(): Promise<RoomCreateResponseDTO> {
    const createdRoom = await this.prisma.roomInfo.create({
      data: {
        players: {
          create: [{}, {}],
        },
      },
    });

    return { roomId: createdRoom.id };
  }

  async getRoomInfo(roomId: number): Promise<RoomInfoDTO> {
    const roomInfo = await this.prisma.roomInfo.findUnique({
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

    const players: PlayerIntoDTO[] = roomInfo.players.map<PlayerIntoDTO>(
      (playerInfo) => {
        return {
          ...playerInfo,
          currentChoice: playerInfo.currentChoice as PlayerChoice,
        };
      },
    );

    return {
      roomId: roomInfo.id,
      players,
    };
  }

  async joinRoom(roomId: number): Promise<number> {
    const roomInfo = await this.prisma.roomInfo.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        players: { select: { id: true }, where: { connected: false } },
      },
    });

    const notConnectedPlayers = roomInfo.players;

    if (notConnectedPlayers.length == 0) {
      return -1;
    }

    await this.prisma.playerInfo.update({
      where: { id: notConnectedPlayers[0].id },
      data: { connected: true },
    });

    return notConnectedPlayers[0].id;
  }

  async leaveRoom(playerId: number): Promise<number> {
    const playerInfo = await this.prisma.playerInfo.update({
      where: { id: playerId },
      data: { connected: false, currentChoice: "NONE" },
      select: { roomInfoId: true },
    });

    return playerInfo.roomInfoId;
  }

  isPlayerChoiceValid(choice: string): choice is PlayerChoice {
    return choice === "ROCK" || choice === "PAPER" || choice === "SCISSORS";
  }

  async makeChoice(roomId: number, playerId: number, choice: PlayerChoice) {
    const roomInfo = await this.prisma.roomInfo.findUnique({
      where: { id: roomId },
      select: { players: true },
    });

    const secondPlayerInfo = roomInfo.players.find(
      (playerInfo) => playerInfo.id != playerId,
    );

    if (secondPlayerInfo.currentChoice == "NONE") {
      this.updatePlayerCurrentChoice(playerId, choice);
      return;
    }

    const winner = this.determineWinner(
      choice,
      secondPlayerInfo.currentChoice as PlayerChoice,
    );

    if (winner == 1) {
      await this.addPointToPlayer(playerId);
    } else if (winner == 2) {
      await this.addPointToPlayer(secondPlayerInfo.id);
    }

    await this.resetChoice(playerId, secondPlayerInfo.id);
  }

  async resetChoice(player1Id: number, player2Id: number) {
    await this.prisma.playerInfo.update({
      where: { id: player1Id },
      data: { currentChoice: "NONE" },
    });
    await this.prisma.playerInfo.update({
      where: { id: player2Id },
      data: { currentChoice: "NONE" },
    });
  }

  async addPointToPlayer(playerId: number) {
    const playerInfo = await this.prisma.playerInfo.findUnique({
      where: { id: playerId },
    });

    await this.prisma.playerInfo.update({
      where: { id: playerId },
      data: { score: playerInfo.score + 1 },
    });
  }

  async updatePlayerCurrentChoice(playerId: number, newChoice: PlayerChoice) {
    await this.prisma.playerInfo.update({
      where: { id: playerId },
      data: { currentChoice: newChoice },
    });
  }

  determineWinner(
    player1Choice: PlayerChoice,
    player2Choice: PlayerChoice,
  ): 0 | 1 | 2 {
    if (player1Choice === player2Choice) {
      return 0;
    } else if (
      (player1Choice === "ROCK" && player2Choice === "SCISSORS") ||
      (player1Choice === "PAPER" && player2Choice === "ROCK") ||
      (player1Choice === "SCISSORS" && player2Choice === "PAPER")
    ) {
      return 1;
    } else {
      return 2;
    }
  }
}
