import { Body, Controller, Get, Post, Render } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";
import { DocumentService } from "src/document/document.service";
import { LoginDto } from "./dto/login.dto";

@Controller('login')
export class LoginController {
  constructor(
    private readonly config: ConfigService,
    private readonly documentService: DocumentService,
  ) {} 

  @Post("/")
  async login(@Body() loginDto: LoginDto) {
    try  {
      const document = await this.documentService.findOne({where: {id: Number(loginDto.login)}})
      console.log(document)
      if(!document || loginDto.password !== document.password) {
        throw new Error("wrong login or password")
      }
      return document
    } catch(err) {
      throw new Error("wrong login or password")
    }
  }

  @Get("/:login?/:pass?")
  @Render("login")
  renderLoginPage() {
    return {url: this.config.get("URL")}
  }
}