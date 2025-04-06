import { Injectable } from "@nestjs/common";
import * as syncfs from 'fs'
import { ConfigService } from "src/config/config.service";

@Injectable()
export class CreatingFoldersService {
  constructor(private readonly configService: ConfigService) {
    this.createFolders(configService.get("PATHS").split(","))
  }

  async createFolders(paths: string[]) {
    for(const path of paths) {
      if (!syncfs.existsSync(path)) syncfs.mkdirSync(path)
    }
  }
}