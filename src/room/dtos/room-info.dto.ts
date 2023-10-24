import { PlayerIntoDTO } from "./player-info.dto";

export class RoomInfoDTO {
  roomId: number;
  round: number;
  players: PlayerIntoDTO[];
}
