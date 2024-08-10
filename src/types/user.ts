interface typeUser {
	id: string;
	name: string;
	email: string;
	password: string | null;
	createdAt: Date | null;
	updatedAt: Date | null;
	department: string | null;
	profilePic: string;
	permissions: string;
}

interface typeUserVisible {
	id: string | null;
	name: string;
	email: string;
	department: string | null;
	profilePic: string | null;
	permissions: string;
}

export type { typeUser, typeUserVisible };
