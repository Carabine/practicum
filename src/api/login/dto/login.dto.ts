import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  login: number;
  
  @IsNotEmpty()
  password: string;
}