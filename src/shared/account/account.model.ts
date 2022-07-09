import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'account' })
export class AccountSchema {
  @Field(() => ID)
  id!: string;

  @Field((type) => Int)
  balance!: number;
}
