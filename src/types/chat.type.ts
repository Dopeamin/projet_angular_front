import { Profile } from "./profile.type";

export interface GroupChatToProfile {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    nickname?: any;
    isAdmin: boolean;
    isMuted: boolean;
    profile: Profile;
    latestSeenMessage?: Message;
    encryptedSymmetricKey: string;
}

export interface Chat {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name?: any;
    picture?: any;
    isPrivate: boolean;
    groupChatToProfiles: GroupChatToProfile[];
    messages: Message[];
    messageBlocks?: Message[][];
    hasMore: boolean;
    page: number;
    pageSize: number;
    lastMessage?: Message;
    symmetricKey: string;
}

export interface Attachment {
    url: string;
    type: string;
}
export interface Data {
    text?: string;
    attachments?: Attachment[];
}

export interface Seen {
    [key: string]: boolean;
}

export interface Message {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    data: Data;
    seen: Seen;
    profile: Profile;
    seenByMe?: boolean;
    isSending?: boolean;
    isEncrypted: boolean;
}