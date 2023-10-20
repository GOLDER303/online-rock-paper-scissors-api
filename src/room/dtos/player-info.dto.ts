import { PlayerChoice } from "src/types/player-choice.type";

export class PlayerIntoDTO {
  id: number;
  currentChoice: PlayerChoice;
  score: number;
  connected: boolean;
}
