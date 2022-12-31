export interface Profile {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    birthday?: Date;
    gender: string;
    bio?: string;
    avatar?: string;
    cover?: string;
    publicKey: string;
}
