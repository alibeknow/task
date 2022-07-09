import { IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  public readonly accountId!: string;
}
