import { Module } from "@nestjs/common";
import { RoomModule } from "./room/room.module";
import { RedisModule } from "@songkeys/nestjs-redis";

@Module({
  imports: [
    RoomModule,
    RedisModule.forRoot({
      config: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
