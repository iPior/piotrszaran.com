import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_CATEGORY_TONE_CLASSES,
  type ProjectCategory,
} from '../../../lib/projects';
import ShieldBadges, { type ShieldBadgeColorMode } from './ShieldBadges';

interface Props {
  itemNumber: number;
  title: string;
  description: string;
  category: ProjectCategory;
  dateLabel: string;
  tags?: string[];
  href?: string;
  liveUrl?: string;
  githubUrl?: string;
  layout?: 'home' | 'list';
  tagColorMode?: ShieldBadgeColorMode;
}

export default function ProjectCard({
  itemNumber,
  title,
  description,
  category,
  dateLabel,
  tags = [],
  href,
  liveUrl,
  githubUrl,
  layout = 'list',
  tagColorMode = 'mapped',
}: Props) {
  const categoryLabel = PROJECT_CATEGORY_LABELS[category];
  const categoryToneClass = PROJECT_CATEGORY_TONE_CLASSES[category];

  return (
    <article class="border-b border-site-border py-4 transition-colors duration-100 sm:hover:-mx-3 sm:hover:rounded sm:hover:bg-site-surface-hover sm:hover:px-3">
      {layout === 'list' && (
        <div class="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs md:hidden sm:ml-[3.25rem]">
          <time class="text-site-dim">{dateLabel}</time>
          <span
            class={`inline-block rounded px-2 py-0.5 font-medium tracking-wider ${categoryToneClass}`}
          >
            {categoryLabel}
          </span>
        </div>
      )}

      <div class="flex items-start gap-3 sm:gap-4">
        <div class="mt-[1px] w-7 text-base font-medium leading-tight text-site-peach sm:w-9 sm:text-lg sm:leading-tight">
          {String(itemNumber).padStart(2, '0')}
        </div>

        <div class="min-w-0 flex-1">
          {href ? (
            <a href={href} class="group inline-flex max-w-full items-start gap-2">
              <h3 class="text-sm font-semibold leading-snug text-site-blue sm:text-base">{title}</h3>
              {layout === 'list' && (
                <span class="text-site-dim transition-colors group-hover:text-site-blue">→</span>
              )}
            </a>
          ) : (
            <h3 class="text-sm font-semibold leading-snug text-site-blue sm:text-base">{title}</h3>
          )}

          {description && (
            <p class="mt-1 line-clamp-3 text-[11px] italic leading-relaxed text-site-dim sm:text-xs">
              {description}
            </p>
          )}

          <ShieldBadges tags={tags} tagColorMode={tagColorMode} />

          {layout === 'list' && (
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-site-blue hover:underline"
                >
                  Live ↗
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-site-blue hover:underline"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div class="hidden w-36 flex-col items-end gap-2 text-right md:flex lg:w-40">
          <span
            class={`inline-block rounded px-2 py-0.5 text-xs font-medium tracking-wider ${categoryToneClass}`}
          >
            {categoryLabel}
          </span>
          <time class="text-xs text-site-dim">{dateLabel}</time>
        </div>
      </div>
    </article>
  );
}
