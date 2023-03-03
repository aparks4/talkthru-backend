import { Profile, User, UserWhereUniqueInput } from "@prisma/client";

export interface IUser {
	id: string;
	name: string;
	email: string;
	password: string;
	matching: boolean;
	subject: string;
	expertise: string;
}

export interface IProfile {
	id: string;
	picture?: string;
	userName?: string;
	bio?: string;
	userId: number;
	occupation?: string;
	location?: string;
}


export interface IDecoded {
	userId: string;
	iat: number;
	exp: number;
}
