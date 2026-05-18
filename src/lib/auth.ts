export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  country: string;
  state: string;
  joinDate: string;
  avatar: string;
}

interface StoredUser extends User { password: string; }

const USERS_KEY = 'ec_users';
const CURRENT_USER_KEY = 'ec_current_user';

const getStoredUsers = (): StoredUser[] => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
};

export const getCurrentUser = (): User | null => {
  try {
    const d = localStorage.getItem(CURRENT_USER_KEY);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
};

export const registerUser = (name: string, email: string, password: string, country = '', state = ''): User => {
  const users = getStoredUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error('An account with this email already exists.');
  const newUser: StoredUser = {
    id: `u_${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    bio: '',
    country,
    state,
    joinDate: new Date().toISOString(),
    avatar: name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const { password: _, ...pub } = newUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(pub));
  return pub;
};

export const loginUser = (email: string, password: string): User => {
  const found = getStoredUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) throw new Error('Invalid email or password. Please try again.');
  const { password: _, ...pub } = found;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(pub));
  return pub;
};

export const logoutUser = () => localStorage.removeItem(CURRENT_USER_KEY);

export const getMemberCount = (): number => getStoredUsers().length;
