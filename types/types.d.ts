import { Profile, User, UserWhereUniqueInput } from "@prisma/client";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  online: boolean;
}


export interface IDecoded {
  userId: number;
  iat: number;
  exp: number;
}
