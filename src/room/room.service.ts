import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { RoomInfo } from "./dtos/room-info.dto";

@Injectable()
export class RoomService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async createRoom() {
    const roomInfo = new RoomInfo();
    await this.redis.set(roomInfo.id, JSON.stringify(roomInfo));
    return roomInfo;
  }

  async getRoom(roomId: string): Promise<RoomInfo> {
    const roomInfoJsonString = await this.redis.get(roomId);
    return JSON.parse(roomInfoJsonString);
  }
}
