export interface SendMessageDto {
    groupChatId: string;
    text: string;
    files?: (File & { src: string })[];
    isEncrypted?: boolean;
}