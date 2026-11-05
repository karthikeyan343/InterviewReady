import type { User } from "../types";

export type { User };

export interface MobileNavDrawerProps {
  open: boolean;
  user: User | null;
  userName: string;
  isNavigationItemActive: (path: string) => boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onProfile: () => void;
  onLogout: () => void;
}
