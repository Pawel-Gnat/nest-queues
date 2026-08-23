import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ReportService } from "./report.service";

@Module({
	controllers: [AppController],
	providers: [ReportService],
})
export class AppModule {}
