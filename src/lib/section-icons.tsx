import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Layers2,
  Mail,
  UserRound,
} from "lucide-react";
import type { SectionId } from "./orbital";

export const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  skills: Layers2,
  education: GraduationCap,
  about: UserRound,
  contact: Mail,
};
