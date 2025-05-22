import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Bookmark,
  BookmarkPlus,
  BookmarkX,
  Brush,
  Building,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Heart,
  Hexagon,
  Home,
  Image,
  ImageOff,
  Info,
  Layout,
  ListFilter,
  Loader,
  LucideIcon,
  LucideProps,
  Menu,
  Moon,
  PaintBucket,
  Palette,
  RefreshCcw,
  Ruler,
  Search,
  Sparkles,
  Star,
  StarOff,
  Sun,
  Tag,
  User,
  X,
} from "lucide-react";

export type IconName =
  | "search"
  | "menu"
  | "close"
  | "heart"
  | "info"
  | "externalLink"
  | "chevronDown"
  | "chevronRight"
  | "chevronLeft"
  | "star"
  | "starOff"
  | "bookmarkPlus"
  | "bookmarkX"
  | "paintBucket"
  | "image"
  | "imageOff"
  | "calendar"
  | "tag"
  | "building"
  | "brush"
  | "palette"
  | "ruler"
  | "user"
  | "filter"
  | "layout"
  | "listFilter"
  | "bookmark"
  | "award"
  | "sparkles"
  | "eye"
  | "eyeOff"
  | "arrowUp"
  | "arrowDown"
  | "arrowLeft"
  | "arrowRight"
  | "moon"
  | "sun"
  | "fileText"
  | "home"
  | "creditCard"
  | "refresh"
  | "loader"
  | "hexagon"
  | "clock";

export const iconComponents: Record<IconName, LucideIcon> = {
  search: Search,
  menu: Menu,
  close: X,
  heart: Heart,
  info: Info,
  externalLink: ExternalLink,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  star: Star,
  starOff: StarOff,
  bookmarkPlus: BookmarkPlus,
  bookmarkX: BookmarkX,
  paintBucket: PaintBucket,
  image: Image,
  imageOff: ImageOff,
  calendar: Calendar,
  tag: Tag,
  building: Building,
  brush: Brush,
  palette: Palette,
  ruler: Ruler,
  user: User,
  filter: Filter,
  layout: Layout,
  listFilter: ListFilter,
  bookmark: Bookmark,
  award: Award,
  sparkles: Sparkles,
  eye: Eye,
  eyeOff: EyeOff,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  moon: Moon,
  sun: Sun,
  fileText: FileText,
  home: Home,
  creditCard: CreditCard,
  refresh: RefreshCcw,
  loader: Loader,
  hexagon: Hexagon,
  clock: Clock,
};

interface IconProps extends LucideProps {
  name: IconName;
}

const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Ícone "${name}" não encontrado`);
    return null;
  }

  return <IconComponent {...props} />;
};

export default Icon;
