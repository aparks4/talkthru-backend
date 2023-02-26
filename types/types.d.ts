import { Profile, User } from "@prisma/client";
import { profile } from "console";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  online: boolean;
  // profile?: Profile;
  // profileId: number;
}



export interface IDecoded {
  userId: number;
  iat: number;
  exp: number;
}
