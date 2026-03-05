import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateUserTagDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}