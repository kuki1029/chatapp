import { User } from "./user";
import { Chat } from "./chat";
import { ChatMember } from "./chatMember";
import { ChatMessage } from "./chatMessage";

Chat.hasMany(ChatMember);
ChatMember.belongsTo(Chat);

User.hasMany(ChatMember);
ChatMember.belongsTo(User);

Chat.hasMany(ChatMessage);
ChatMessage.belongsTo(Chat);

User.hasMany(ChatMessage);
ChatMessage.belongsTo(User);

export { Chat, User, ChatMember, ChatMessage };
