import { Controller, Get, Param, Post } from "@nestjs/common";
import { RoomCreateResponseDTO } from "./dtos/room-create-response.dto";
import { RoomInfoDTO } from "./dtos/room-info.dto";
import { RoomService } from "./room.service";

@Controller("/room")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post("/")
  async createRoom(): Promise<RoomCreateResponseDTO> {
    return await this.roomService.createRoom();
  }

  @Get("/:id")
  async getRoom(@Param("id") roomId: string): Promise<RoomInfoDTO> {
    return await this.roomService.getRoomInfo(parseInt(roomId));
  }
}
