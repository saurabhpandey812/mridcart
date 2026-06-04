import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Address, CartItem, Order, PaymentMethod, User } from '../types';

const USER_KEY = 'ecommerce-user';
const ORDERS_KEY = 'ecommerce-orders';
const USERS_KEY = 'ecommerce-users';

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (input: RegisterInput) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) => void;
  placeOrder: (params: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    address: Address;
    paymentMethod: PaymentMethod;
  }) => Order;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const login = useCallback((email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return false;
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return true;
  }, []);

  const register = useCallback((input: RegisterInput) => {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return false;
    }
    const newUser: StoredUser = {
      id: generateId('user'),
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback(
    (data: Partial<Pick<User, 'name' | 'phone'>>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      setUser(updated);
      const users = loadUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    },
    [user]
  );

  const placeOrder = useCallback(
    (params: {
      items: CartItem[];
      subtotal: number;
      deliveryFee: number;
      total: number;
      address: Address;
      paymentMethod: PaymentMethod;
    }) => {
      const order: Order = {
        id: generateId('order'),
        userId: user?.id ?? null,
        items: params.items,
        subtotal: params.subtotal,
        deliveryFee: params.deliveryFee,
        total: params.total,
        address: params.address,
        paymentMethod: params.paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [user]
  );

  const userOrders = useMemo(
    () => (user ? orders.filter((o) => o.userId === user.id) : []),
    [orders, user]
  );

  const value = useMemo(
    () => ({
      user,
      orders: userOrders,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      placeOrder,
    }),
    [user, userOrders, login, register, logout, updateProfile, placeOrder]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
