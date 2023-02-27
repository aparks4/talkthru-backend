import { Profile, User, UserWhereUniqueInput } from "@prisma/client";

export interface IUser {
	id: number;
	name: string;
	email: string;
	password: string;
	matching: boolean;
	subject: string;
	expertise: string;
}

export interface IProfile {
	id: number;
	picture?: string;
	userName?: string;
	bio?: string;
	userId: number;
	occupation?: string;
	location?: string;
}


export interface IDecoded {
  userId: number;
  iat: number;
  exp: number;
}
