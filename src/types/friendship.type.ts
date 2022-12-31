import { Profile } from "./profile.type";

export interface Friendship {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    sender: Profile;
    receiver: Profile;
    status: "pending" | "accepted" | "rejected" | "cancelled" | "blocked";
}