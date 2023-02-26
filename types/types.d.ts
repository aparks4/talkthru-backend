export interface IUser {
	id: number;
	name: string;
	email: string;
	password: string;
	matching: boolean;
	subject: string;
	expertise: string;
}

export interface IDecoded {
  userId: number;
  iat: number;
  exp: number;
}
