import { v4 as uuidv4 } from "uuid";

type PlayerInfo = {
  score: number;
  currentChoice: "NONE" | "ROCK" | "PAPER" | "SCISSORS";
};

export class RoomInfo {
  id: string;
  player1: PlayerInfo;
  player2: PlayerInfo;

  constructor() {
    this.id = uuidv4();
    this.player1 = { score: 0, currentChoice: "NONE" };
    this.player2 = { score: 0, currentChoice: "NONE" };
  }
}
