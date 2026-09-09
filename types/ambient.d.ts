/* Fallback ambient declarations when node_modules is pending local npm install */

declare module 'react' {
  export = React;
  export as namespace React;
}

declare namespace React {
  export type ReactNode = any;
  export type ReactElement = any;
  export type ComponentType<P = any> = any;
  export type FC<P = any> = (props: P) => any;
  export type CSSProperties = Record<string, any>;
  export type Key = string | number | bigint;
  export type Ref<T = any> = any;
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);

  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useCallback<T extends Function>(callback: T, deps: readonly any[]): T;
  export function useRef<T>(initialValue?: T): { current: T };
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export function useId(): string;

  export type ChangeEvent<T = HTMLElement> = {
    target: T & { value: string; checked: boolean };
    currentTarget: T & { value: string; checked: boolean };
    preventDefault(): void;
    stopPropagation(): void;
  };

  export type MouseEvent<T = HTMLElement> = {
    preventDefault(): void;
    stopPropagation(): void;
    currentTarget: T;
    target: any;
  };

  export type KeyboardEvent<T = HTMLElement> = {
    key: string;
    preventDefault(): void;
    stopPropagation(): void;
  };

  export type FormEvent<T = HTMLElement> = {
    preventDefault(): void;
    stopPropagation(): void;
  };

  namespace JSX {
    interface Element extends ReactElement {}
    interface ElementClass {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement {}
    interface ElementClass {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface IntrinsicAttributes {
      key?: React.Key;
    }
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'next/link' {
  import { FC, ReactNode } from 'react';
  export interface LinkProps {
    href: string;
    children?: ReactNode;
    className?: string;
    target?: string;
    rel?: string;
    onClick?: (e: any) => void;
    [key: string]: any;
  }
  const Link: FC<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import { FC } from 'react';
  const Image: FC<any>;
  export default Image;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    prefetch: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
}

declare module 'lucide-react' {
  import { FC } from 'react';
  export interface LucideProps {
    className?: string;
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    [key: string]: any;
  }
  export type LucideIcon = FC<LucideProps>;
  export const ShieldAlert: LucideIcon;
  export const Users: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Shield: LucideIcon;
  export const Layers: LucideIcon;
  export const Gamepad2: LucideIcon;
  export const FileText: LucideIcon;
  export const BarChart3: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Download: LucideIcon;
  export const Award: LucideIcon;
  export const Palette: LucideIcon;
  export const Volume2: LucideIcon;
  export const Image: LucideIcon;
  export const Settings: LucideIcon;
  export const Search: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Edit2: LucideIcon;
  export const Trash2: LucideIcon;
  export const Save: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Sparkles: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Target: LucideIcon;
  export const Flame: LucideIcon;
  export const Zap: LucideIcon;
  export const Brain: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Sliders: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Star: LucideIcon;
  export const Trophy: LucideIcon;
  export const Calendar: LucideIcon;
  export const Clock: LucideIcon;
  export const Bell: LucideIcon;
  export const Lock: LucideIcon;
  export const Unlock: LucideIcon;
  export const Check: LucideIcon;
  export const X: LucideIcon;
  export const Info: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Moon: LucideIcon;
  export const Sun: LucideIcon;
  export const Globe: LucideIcon;
  export const Filter: LucideIcon;
  export const Play: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Compass: LucideIcon;
  export const Activity: LucideIcon;
  export const Send: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const LogIn: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Key: LucideIcon;
  export const Mail: LucideIcon;
  export const Heart: LucideIcon;
  export const Share2: LucideIcon;
  export const Printer: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sparkle: LucideIcon;
}

declare module 'canvas-confetti' {
  const confetti: any;
  export default confetti;
}

declare module 'clsx' {
  export type ClassValue = any;
  export function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}

declare module 'tailwind-merge' {
  export function twMerge(...classLists: any[]): string;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}
