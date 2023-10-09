import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "./room.service";

@WebSocketGateway()
export class RoomGateway implements OnGatewayDisconnect {
  constructor(private readonly roomService: RoomService) {}

  async handleDisconnect(client: Socket) {
    await this.roomService.leaveRoom(client.data["playerId"]);
  }

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage("room:join")
  async joinRoom(client: Socket, roomId: string) {
    const playerId = await this.roomService.joinRoom(parseInt(roomId));

    if (playerId == -1) {
      client.emit("room:full");
    }

    client.data.playerId = playerId;

    client.join(roomId.toString());

    client.emit("room:joined", { playerId });

    const roomInfo = await this.roomService.getRoomInfo(parseInt(roomId));

    this.wss.to(roomId.toString()).emit("room:update", roomInfo);
  }

  @SubscribeMessage("room:leave")
  async leaveRoom(client: Socket) {
    await this.roomService.leaveRoom(client.data["playerId"]);
  }
}
