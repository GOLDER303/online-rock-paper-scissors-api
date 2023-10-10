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
    client.data.roomId = parseInt(roomId);

    client.join(roomId.toString());

    client.emit("room:joined", { playerId });

    const roomInfo = await this.roomService.getRoomInfo(parseInt(roomId));

    this.wss.to(roomId.toString()).emit("room:update", roomInfo);
  }

  @SubscribeMessage("room:leave")
  async leaveRoom(client: Socket) {
    await this.roomService.leaveRoom(client.data["playerId"]);
  }

  @SubscribeMessage("room:choice")
  async makeChoice(client: Socket, choice: string) {
    const roomId = client.data["roomId"] as number;
    const playerId = client.data["playerId"] as number;

    if (!roomId || !playerId) {
      client.emit("error", "You need to be in room to make choice");
      return;
    }

    if (!this.roomService.isPlayerChoiceValid(choice)) {
      client.emit("error", `The choice: ${choice} is invalid`);
      return;
    }

    await this.roomService.makeChoice(roomId, playerId, choice);

    const roomInfo = await this.roomService.getRoomInfo(
      parseInt(roomId.toString()),
    );

    this.wss.to(roomId.toString()).emit("room:update", roomInfo);
  }
}
