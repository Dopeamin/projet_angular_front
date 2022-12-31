import { Profile } from "./profile.type";

export default interface User {
    id: number;
    email: string;
    phonenumber?: string;
    profile: Profile;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    encryptedPrivateKey: string;
}