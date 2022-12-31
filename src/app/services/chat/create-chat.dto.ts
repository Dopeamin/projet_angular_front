export class CreateGroupChatDTO {
    name?: string;

    encryptedSymmetricKey: string;
    
    members: Member[] = [];
}

export type Member = {
    id: string;
    encryptedSymmetricKey: string;
}