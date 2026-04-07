import { useState } from 'preact/hooks';
import { formatDate } from '../../lib/utils';
import {
  type ProjectCategory,
} from '../../lib/projects';
import ProjectCard from './ProjectCard';
import ProjectFilterHeader from './ProjectFilterHeader';
import ProjectCategoryFilters, {
  type FilterCategory,
} from './ProjectCategoryFilters';

interface Project {
  id: string;
  title: string;
  date: string;
  category: ProjectCategory;
  description: string;
  stack?: string[];
  thumbnail?: string;
  liveUrl?: string;
  githubUrl?: string;
  blogSlug?: string;
}

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterCategory>('all');

  const filtered =
    active === 'all' ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div class="flex flex-col gap-3 border-b border-site-border pb-2.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <ProjectFilterHeader itemCount={filtered.length} />
        <ProjectCategoryFilters active={active} onChange={setActive} />
      </div>

      {/* Project list */}
      {filtered.length === 0 ? (
        <p class="pt-6 text-site-dim text-sm">No projects in this category.</p>
      ) : (
        <div class="pt-3.5">
          {filtered.map((project, idx) => (
            <ProjectCard
              key={project.id}
              itemNumber={filtered.length - idx}
              title={project.title}
              description={project.description}
              category={project.category}
              dateLabel={formatDate(new Date(project.date))}
              tags={project.stack ?? []}
              href={`/projects/${project.id}`}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
              layout="list"
              tagColorMode="mapped"
            />
          ))}
        </div>
      )}
    </div>
  );
}
