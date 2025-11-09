import {create} from 'zustand';
import {User, Match, Message, FilterSettings, AuthCredentials} from '../types';
import {CURRENT_USER, DUMMY_USERS, DUMMY_MATCHES, DUMMY_MESSAGES} from '../data/dummyData';

interface AppState {
  currentUser: User | null;
  users: User[];
  allUsers: User[];
  matches: Match[];
  chats: {[key: string]: Message[]};
  isAuthenticated: boolean;
  filters: FilterSettings;
  hasUnsavedChanges: boolean;
  
  // Auth Actions
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (credentials: AuthCredentials) => Promise<boolean>;
  logout: () => void;
  
  // User Actions
  updateCurrentUser: (user: Partial<User>) => void;
  saveProfile: () => void;
  setUnsavedChanges: (value: boolean) => void;
  
  // Swipe Actions
  swipeLeft: (userId: string) => void;
  swipeRight: (userId: string) => void;
  addMatch: (user: User) => void;
  getNextUser: () => User | null;
  
  // Chat Actions
  sendMessage: (matchId: string, text: string) => void;
  markMessagesAsRead: (matchId: string) => void;
  
  // Filter Actions
  updateFilters: (filters: Partial<FilterSettings>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

// Simulated API calls
const simulateApiCall = (delay: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, delay));

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [...DUMMY_USERS],
  allUsers: [...DUMMY_USERS],
  matches: [],
  chats: {},
  isAuthenticated: false,
  hasUnsavedChanges: false,
  filters: {
    gender: ['Female'],
    ageRange: [18, 80],
    distance: 50,
    showNearbyWhenEmpty: true,
    languages: [],
  },

  // Auth Actions
  login: async (credentials) => {
    await simulateApiCall(1500);
    
    // Simple validation - in real app, call API
    if (credentials.email && credentials.password.length >= 6) {
      set({
        isAuthenticated: true,
        currentUser: {...CURRENT_USER, email: credentials.email},
        matches: DUMMY_MATCHES,
        chats: DUMMY_MESSAGES,
      });
      return true;
    }
    return false;
  },

  register: async (credentials) => {
    await simulateApiCall(1500);
    
    // Validation
    if (credentials.email && credentials.password.length >= 6 && credentials.name) {
      const newUser: User = {
        ...CURRENT_USER,
        id: Date.now().toString(),
        name: credentials.name,
        email: credentials.email,
      };
      
      set({
        isAuthenticated: true,
        currentUser: newUser,
        matches: [],
        chats: {},
      });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      matches: [],
      chats: {},
      hasUnsavedChanges: false,
      users: [...DUMMY_USERS],
      allUsers: [...DUMMY_USERS],
    });
  },

  // User Actions
  updateCurrentUser: (userData) => {
    set((state) => ({
      currentUser: state.currentUser ? {...state.currentUser, ...userData} : null,
      hasUnsavedChanges: true,
    }));
  },

  saveProfile: () => {
    // In real app: call API to save
    set({hasUnsavedChanges: false});
  },

  setUnsavedChanges: (value) => {
    set({hasUnsavedChanges: value});
  },

  // Swipe Actions
  swipeLeft: (userId) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    }));
  },

  swipeRight: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (user) {
      const isMatch = Math.random() > 0.2;
      if (isMatch) {
        get().addMatch(user);
      }
      get().swipeLeft(userId);
    }
  },

  addMatch: (user) => {
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      user,
      matchedAt: new Date(),
      unreadCount: 0,
    };
    
    set((state) => ({
      matches: [newMatch, ...state.matches],
      chats: {
        ...state.chats,
        [newMatch.id]: [],
      },
    }));
  },

  getNextUser: () => {
    const {users} = get();
    return users.length > 0 ? users[0] : null;
  },

  // Chat Actions
  sendMessage: (matchId, text) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      receiverId: matchId,
      text,
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      chats: {
        ...state.chats,
        [matchId]: [...(state.chats[matchId] || []), message],
      },
      matches: state.matches.map((m) =>
        m.id === matchId ? {...m, lastMessage: message} : m,
      ),
    }));
  },

  markMessagesAsRead: (matchId) => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? {...m, unreadCount: 0} : m,
      ),
      chats: {
        ...state.chats,
        [matchId]: state.chats[matchId]?.map(msg => ({...msg, read: true})) || [],
      },
    }));
  },

  // Filter Actions
  updateFilters: (newFilters) => {
    set((state) => ({
      filters: {...state.filters, ...newFilters},
    }));
  },

  applyFilters: () => {
    const {filters, allUsers} = get();
    
    // Apply filters to users list
    let filteredUsers = [...allUsers];
    
    // Gender filter
    if (filters.gender.length > 0) {
      filteredUsers = filteredUsers.filter(user => 
        filters.gender.includes(user.details.gender || '')
      );
    }
    
    // Age filter
    filteredUsers = filteredUsers.filter(user => 
      user.age >= filters.ageRange[0] && user.age <= filters.ageRange[1]
    );
    
    // Distance filter
    filteredUsers = filteredUsers.filter(user => 
      user.distance <= filters.distance
    );
    
    // Language filter
    if (filters.languages.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        filters.languages.some(lang => user.languages.includes(lang))
      );
    }
    
    set({users: filteredUsers});
  },

  clearFilters: () => {
    set({
      filters: {
        gender: ['Female'],
        ageRange: [18, 80],
        distance: 50,
        showNearbyWhenEmpty: true,
        languages: [],
      },
      users: [...get().allUsers],
    });
  },
}));