export enum Endpoints {
  /* Auth */
  Register = "/auth/register",
  Login = "/auth/login",
  WhoAmI = "/auth/whoami",
  /* Chat */
  Chats = "/chat",
  Chat = "/chat/",
  ChatWith = '/chat/with/',
  Messages = "/chat/messages/",
  DeleteMessage = "/chat/message/",
  SendMessage = "/chat/send-message/",
  UpdateGroupMember = "/chat/members/",
  CreateGroupChat = "/chat",
  /* Profile */
  Profile = "/profile/",
  /* FriendShip */
  Friendships = "/friendships/",
  AcceptFriendRequest = "/friendships/accept/",
  DeclineFriendRequest = "/friendships/reject/",
}

