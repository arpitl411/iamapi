import { Expose } from 'class-transformer';

/**
 * User response shape — only exposes safe, non-null fields.
 * Password and internal fields are never serialized.
 */
export class UserResponseDto {
  @Expose()
  id!: number;

  @Expose()
  first_name!: string;

  @Expose()
  last_name!: string;

  @Expose()
  email!: string;

  @Expose()
  active!: boolean;

  @Expose()
  confirmed!: boolean;

  @Expose()
  uuid!: string;

  @Expose()
  userName!: string;

  @Expose()
  phoneCountryCode!: string;

  @Expose()
  phoneNo!: string;

  @Expose()
  profilePic!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  // password, rememberToken, tsv, confirmationCode → never exposed
}
