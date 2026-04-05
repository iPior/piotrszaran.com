import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_CATEGORY_TONE_CLASSES,
  type ProjectCategory,
} from '../../lib/projects';
import ShieldBadges, { type ShieldBadgeColorMode } from './ShieldBadges';

interface Props {
  index: number;
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
  index,
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
    <article class="border-b border-site-border py-4 transition-colors duration-100 hover:-mx-3 hover:rounded hover:bg-site-surface-hover hover:px-3">
      <div class="flex items-start gap-4">
        <div class="w-9 text-lg font-medium leading-tight text-site-peach max-sm:w-7">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div class="min-w-0 flex-1">
          {href ? (
            <a href={href} class="group inline-flex items-center gap-2">
              <h3 class="text-base font-semibold leading-snug text-site-blue">{title}</h3>
              {layout === 'list' && (
                <span class="text-site-dim transition-colors group-hover:text-site-blue">→</span>
              )}
            </a>
          ) : (
            <h3 class="text-base font-semibold leading-snug text-site-blue">{title}</h3>
          )}

          <ShieldBadges tags={tags} tagColorMode={tagColorMode} />

          {description && (
            <p class="mt-1 text-xs italic leading-relaxed text-site-dim">{description}</p>
          )}

          {layout === 'list' && (
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span
                class={`inline-block rounded px-2 py-0.5 font-medium tracking-wider sm:hidden ${categoryToneClass}`}
              >
                {categoryLabel}
              </span>
              <time class="text-site-dim sm:hidden">{dateLabel}</time>
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

        <div class="flex w-40 flex-col items-end gap-2 text-right max-sm:hidden">
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
