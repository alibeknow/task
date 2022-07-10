import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AccountDto {
  @IsNotEmpty()
  @IsString()
  public readonly balance!: number;

  @IsNotEmpty()
  @IsString()
  public readonly firstName!: string;

  @IsNotEmpty()
  @IsOptional()
  public readonly lastName!: string;
}
