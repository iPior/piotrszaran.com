import { getTechnology } from "../../../lib/technologies";
import {
  DEFAULT_THEME_BADGE_COLOR,
  THEME_COLOR_PLACEHOLDER,
  getShieldSrc,
  type ShieldBadgeColorMode,
} from "../../../lib/techBadges";

interface Props {
  tags?: string[];
  tagColorMode?: ShieldBadgeColorMode;
  class?: string;
}

export default function ShieldBadges({
  tags = [],
  tagColorMode = "mapped",
  class: className = "mt-2 mb-4 flex flex-wrap gap-1",
}: Props) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div class={className}>
      {tags.map((tag, idx) => {
        const mappedColor = getTechnology(tag)?.badgeColor;
        const usesThemeDefault =
          tagColorMode === "uniform" || mappedColor === undefined;
        const initialColor = usesThemeDefault
          ? DEFAULT_THEME_BADGE_COLOR
          : mappedColor;
        const logoColorMode: ShieldBadgeColorMode = usesThemeDefault
          ? "uniform"
          : "mapped";

        return (
          <img
            key={`${tag}-${idx}`}
            src={getShieldSrc(tag, initialColor, logoColorMode)}
            data-theme-shield-template={
              usesThemeDefault
                ? getShieldSrc(tag, THEME_COLOR_PLACEHOLDER, "uniform")
                : undefined
            }
            alt={`${tag} badge`}
            class="relative z-60 h-5"
            loading="lazy"
            decoding="async"
          />
        );
      })}
    </div>
  );
}
