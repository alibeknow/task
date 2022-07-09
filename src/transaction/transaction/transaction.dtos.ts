import { IsString, IsDecimal } from 'class-validator';

export class TransactionDto {
  @IsString()
  public readonly from!: string;

  @IsString()
  public readonly to!: string;

  @IsDecimal()
  public readonly money!: string;

  @IsString()
  public readonly message!: string;
}
