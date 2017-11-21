export class ChatMessage {
    $key?: string;
    email?: string;
    displayName?: string;
    message?: string;
    timeStamp?: Date = new Date();
    uid?: string;
}