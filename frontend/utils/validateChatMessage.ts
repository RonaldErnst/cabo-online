import { ok, err, Result } from "neverthrow";

export default function validateChatMessage(message: string): Result<string, string> {
    let msg = message;
    msg = msg.replaceAll("\r\n", " ").replaceAll("\n", " "); // No linebreaks
    msg = msg.replaceAll(/\s\s+/g, " "); // Only one whitespace
    msg = msg.trim();
    
    if(msg.length === 0)
        return err("Message cannot be empty");

    return ok(msg);
}