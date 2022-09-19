import { ok, err, Result } from "neverthrow";
import settings from "settings.frontend";

export default function validateChatMessage(message: string): Result<string, string> {
    let msg = message;
    msg = msg.replaceAll("\r\n", " ").replaceAll("\n", " "); // No linebreaks
    msg = msg.replaceAll(/\s\s+/g, " "); // Only one whitespace
    msg = msg.trim();
    
    if(msg.length === 0)
        return err("Message cannot be empty");
    else if (msg.length > settings.chatMessageMaxLength)
        return err("Message must be at most 1000 characters long")

    return ok(msg);
}