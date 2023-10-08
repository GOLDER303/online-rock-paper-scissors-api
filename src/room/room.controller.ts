import { Controller, Get, Param, Post } from "@nestjs/common";
import { RoomService } from "./room.service";

@Controller("/room")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post("/")
  async createRoom() {
    return this.roomService.createRoom();
  }

  @Get("/:id")
  async getRoom(@Param("id") roomId: string) {
    return this.roomService.getRoom(roomId);
  }
}
