import { useState } from 'preact/hooks';
import { formatDate } from '../../../lib/utils';
import { COLLECTIONS, type CollectionId } from '../../../lib/collections';
import type { ProjectCategory } from '../../../lib/projects';
import ProjectCard from './ProjectCard';
import ProjectCategoryFilters, { type FilterCategory } from './ProjectCategoryFilters';

interface Project {
  id: string;
  itemNumber: number;
  title: string;
  date: string;
  category: ProjectCategory;
  description: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  depth: 'short' | 'full';
  inProgress: boolean;
  featured: boolean;
  era: 'current' | 'earlier';
  collections: CollectionId[];
}

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterCategory>('all');
  const [view, setView] = useState<'curated' | 'timeline'>('curated');
  const [collection, setCollection] = useState('all');
  const filtered = projects.filter((p) =>
    (active === 'all' || p.category === active) &&
    (collection === 'all' || p.collections.includes(collection as CollectionId)));
  const curated = filtered.filter((p) => !p.featured && !p.inProgress);
  const groups = view === 'timeline'
    ? [{ title: 'Complete timeline', description: 'Every project, newest first. Numbers mark their place in the archive.', entries: filtered }]
    : [
      { title: 'More builds', description: 'Apps, tools, client work, and experiments worth exploring.', entries: curated.filter((p) => p.era !== 'earlier') },
      { title: 'Earlier work', description: 'Where I started. Kept here as a record of learning and progress.', entries: curated.filter((p) => p.era === 'earlier') },
    ];
  const count = groups.reduce((total, group) => total + group.entries.length, 0);

  return (
    <div>
      <div class="border-b border-site-border pb-5">
        <h2 class="text-lg font-semibold text-site-text sm:text-xl">Explore projects</h2>
        <p class="mt-1 text-xs text-site-subtext">Browse the rest, or switch to the complete timeline for every project.</p>
        <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div class="flex rounded-lg border border-site-border p-1" aria-label="Project view">
            {(['curated', 'timeline'] as const).map((mode) => (
              <button type="button" aria-pressed={view === mode} onClick={() => setView(mode)}
                class={`rounded-md px-3 py-1.5 text-xs transition-colors ${view === mode ? 'bg-site-blue text-site-bg' : 'text-site-subtext hover:text-site-text'}`}>
                {mode === 'curated' ? 'Curated' : 'Complete timeline'}
              </button>
            ))}
          </div>
          <ProjectCategoryFilters active={active} onChange={setActive} />
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label class="flex items-center gap-2 text-xs text-site-subtext">
            Collection
            <select value={collection} onChange={(event) => setCollection(event.currentTarget.value)} class="max-w-full rounded-md border border-site-border bg-site-bg px-2 py-1.5 text-site-text">
              <option value="all">All collections</option>
              {Object.entries(COLLECTIONS).map(([id, item]) => <option value={id}>{item.title}</option>)}
            </select>
          </label>
          <p role="status" class="text-xs text-site-subtext">{count} {count === 1 ? 'project' : 'projects'}</p>
        </div>
      </div>
      {groups.filter((group) => group.entries.length > 0).map((group) => (
        <section class="mt-7" aria-label={group.title}>
          <h3 class="font-semibold text-site-text">{group.title}</h3>
          <p class="mt-1 mb-3 text-xs text-site-subtext">{group.description}</p>
          {group.entries.map((project) => view === 'curated' && project.era === 'earlier' ? (
            <article class="flex items-baseline justify-between gap-4 border-b border-site-border py-3">
              <div>
                <a class="text-sm text-site-blue hover:underline" href={`/projects/${project.id}`}>{project.title} →</a>
                <p class="mt-1 text-xs text-site-subtext">{project.description}</p>
              </div>
              <time class="shrink-0 text-xs text-site-subtext" datetime={project.date}>{new Date(project.date).getUTCFullYear()}</time>
            </article>
          ) : (
            <ProjectCard key={project.id} itemNumber={view === 'timeline' ? project.itemNumber : undefined}
              title={project.title} description={project.description} category={project.category}
              dateLabel={formatDate(new Date(project.date))} tags={project.stack}
              href={`/projects/${project.id}`} liveUrl={project.liveUrl} githubUrl={project.githubUrl}
              depth={project.depth} inProgress={project.inProgress} layout="list" tagColorMode="mapped" />
          ))}
        </section>
      ))}
      {count === 0 && <p class="py-8 text-sm text-site-subtext">No projects match these filters.{view === 'curated' && ' Selected and in-progress projects are above, and included in the complete timeline.'}</p>}
    </div>
  );
}
