import {
  Home,
  CalendarDays,
  FolderKanban,
  Briefcase,
  Wallet,
  Target,
  Flame,
  Sparkles,
  BookOpen,
  GraduationCap,
  Bot,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Cours", href: "/courses", icon: GraduationCap },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Business", href: "/business", icon: Briefcase },
  { label: "Finances", href: "/finances", icon: Wallet },
  { label: "Habits", href: "/habits", icon: Flame },
  { label: "Creative", href: "/creative", icon: Sparkles },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Nova AI", href: "/nova", icon: Bot },
];
