import { useState } from 'preact/hooks';
import { formatDate } from '../../../lib/utils';
import {
  type ProjectCategory,
  PROJECT_GROUPS,
  projectGroup,
} from '../../../lib/projects';
import ProjectCard from './ProjectCard';
import ProjectCategoryFilters, {
  type FilterCategory,
} from './ProjectCategoryFilters';

interface Project {
  id: string;
  itemNumber: number;
  title: string;
  date: string;
  category: ProjectCategory;
  description: string;
  stack?: string[];
  thumbnail?: string;
  liveUrl?: string;
  githubUrl?: string;
  blogSlug?: string;
  depth?: 'short' | 'full';
  inProgress?: boolean;
  featured?: boolean;
  group?: 'main' | 'small' | 'earlier';
}

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterCategory>('all');
  const [view, setView] = useState<'grouped' | 'chronological'>('grouped');

  const filtered =
    active === 'all' ? projects : projects.filter((p) => p.category === active);

  const sections = view === 'chronological'
    ? [{ id: 'all', title: 'All projects', description: 'The complete record, newest first.', projects: filtered }]
    : PROJECT_GROUPS.map((group) => ({
        ...group,
        projects: filtered.filter((project) => projectGroup(project) === group.id),
      })).filter((group) => group.projects.length > 0);

  return (
    <div>
      <div class="flex flex-col gap-3 border-b border-site-border pb-2.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <h2 class="text-lg font-semibold text-site-text">Explore the rest</h2>
        <ProjectCategoryFilters active={active} onChange={setActive} />
      </div>

      <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Project view">
        {(['grouped', 'chronological'] as const).map((mode) => (
          <button type="button" aria-pressed={view === mode} onClick={() => setView(mode)}
            class={`rounded-md border px-3 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-blue ${view === mode ? 'border-site-blue bg-site-blue/10 text-site-blue' : 'border-site-border text-site-subtext hover:text-site-text'}`}>
            {mode === 'grouped' ? 'By section' : 'Everything · newest first'}
          </button>
        ))}
      </div>
      <p class="mt-3 text-xs text-site-subtext">{view === 'grouped' ? 'Selected work is above. Filter the remaining projects below, or switch to the complete chronological list.' : `${filtered.length} projects, including selected work.`}</p>

      {/* Project list */}
      {sections.length === 0 ? (
        <p class="pt-6 text-site-dim text-sm">No projects in this category.</p>
      ) : (
        <div>
          {sections.map((section) => (
            <section key={section.id} class="mt-10" aria-labelledby={`group-${section.id}`}>
              <div class="border-b border-site-border pb-4">
                <h3 id={`group-${section.id}`} class="text-lg font-semibold text-site-text">{section.title} <span class="ml-2 text-xs font-normal text-site-dim">{section.projects.length}</span></h3>
                <p class="mt-1 max-w-xl text-sm leading-relaxed text-site-subtext">{section.description}</p>
              </div>
              {section.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  itemNumber={project.itemNumber}
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  dateLabel={formatDate(new Date(project.date))}
                  tags={project.stack ?? []}
                  href={`/projects/${project.id}`}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                  depth={project.depth}
                  inProgress={project.inProgress}
                  layout="list"
                  tagColorMode="mapped"
                />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
