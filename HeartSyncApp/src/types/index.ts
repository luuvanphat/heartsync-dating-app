export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  occupation: string;
  location: string;
  distance: number;
  photos: string[];
  interests: string[];
  languages: string[];
  details: {
    height?: string;
    smoking?: string;
    drinking?: string;
    pets?: string;
    children?: string;
    zodiac?: string;
    religion?: string;
    education?: string;
    gender?: string;
  };
  verified?: boolean;
  pronouns?: string;
  isOnline?: boolean;
  email?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface FilterSettings {
  gender: string[];
  ageRange: [number, number];
  distance: number;
  showNearbyWhenEmpty: boolean;
  languages: string[];
}

export interface Match {
  id: string;
  user: User;
  matchedAt: Date;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  match: Match;
  messages: Message[];
}

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  ChatDetail: { matchId: string };
  ProfileDetail: { userId: string };
  EditProfile: undefined;
  Filters: undefined;
  VideoCall: { matchId: string };
  UpgradePremium: undefined;
  Settings: undefined;
  // Matches: undefined;
  // Profile: undefined;
};

export type MainTabParamList = {
  Swipe: undefined;
  Matches: undefined;
  Profile: undefined;
};