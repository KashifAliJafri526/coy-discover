export type SwipeAction = "like" | "pass";

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  interests: string[];
}

export interface Swipe {
  swiperId: string;
  targetId: string;
  action: SwipeAction;
  createdAt: string;
}

export interface Match {
  id: string;
  userOneId: string;
  userTwoId: string;
  createdAt: string;
}

export interface Database {
  profiles: Profile[];
  swipes: Swipe[];
  matches: Match[];
  incomingLikes: string[];
}