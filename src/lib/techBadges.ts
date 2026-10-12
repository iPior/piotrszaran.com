import { getTechnology } from "./technologies";

export type ShieldBadgeColorMode = "uniform" | "mapped";

export const THEME_COLOR_PLACEHOLDER = "__THEME_DEFAULT_BADGE_COLOR__";
export const DEFAULT_THEME_BADGE_COLOR = "585b70";
const DEFAULT_LOGO_COLOR = "ffffff";

export function getShieldSrc(
  tag: string,
  color: string,
  logoColorMode: ShieldBadgeColorMode,
): string {
  const technology = getTechnology(tag);
  const encodedTag = encodeURIComponent(tag);
  const logo = technology?.badgeLogo ?? technology?.simpleIcon;
  const logoColor =
    technology?.preserveBadgeLogoColor && logoColorMode === "mapped"
      ? undefined
      : DEFAULT_LOGO_COLOR;

  if (!logo) {
    return `https://img.shields.io/badge/${encodedTag}-${color}?style=flat-square`;
  }

  return `https://img.shields.io/badge/${encodedTag}-${color}?style=flat-square&logo=${encodeURIComponent(logo)}${
    logoColor ? `&logoColor=${logoColor}` : ""
  }`;
}
