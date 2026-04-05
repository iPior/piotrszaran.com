/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import { formatDate } from '../../lib/utils';
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_CATEGORY_TONE_CLASSES,
  type ProjectCategory,
} from '../../lib/projects';

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

const CATEGORY_LABELS = {
  all: 'All',
  ...PROJECT_CATEGORY_LABELS,
} as const;

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<'all' | ProjectCategory>('all');

  const filtered =
    active === 'all' ? projects : projects.filter((p) => p.category === active);

  const categories: Array<'all' | ProjectCategory> = ['all', 'freelance', 'work', 'personal'];

  return (
    <div>
      {/* Filter buttons */}
      <div class="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            class={`text-sm border rounded-full px-3 py-1 transition-colors ${
              active === cat
                ? 'bg-site-blue text-site-bg border-site-blue'
                : 'border-site-border text-site-subtext hover:border-site-subtext'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Project list */}
      {filtered.length === 0 ? (
        <p class="text-site-dim text-sm">No projects in this category.</p>
      ) : (
        <div>
          {filtered.map((project, idx) => (
            <article
              key={project.id}
              class="border-b border-site-border py-4 transition-colors duration-100 hover:-mx-3 hover:rounded hover:bg-site-surface-hover hover:px-3"
            >
              <div class="flex items-start gap-4">
                <div class="w-9 text-lg font-medium leading-tight text-site-peach max-sm:w-7">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div class="min-w-0 flex-1">
                  <a href={`/projects/${project.id}`} class="group inline-flex items-center gap-2">
                    <h3 class="text-base font-semibold leading-snug text-site-blue">{project.title}</h3>
                    <span class="text-site-dim transition-colors group-hover:text-site-blue">→</span>
                  </a>
                  {project.description && (
                    <p class="mt-1 text-xs italic leading-relaxed text-site-dim">{project.description}</p>
                  )}
                  {project.stack && project.stack.length > 0 && (
                    <div class="mt-2.5 flex flex-wrap gap-1">
                      {project.stack.map((tech) => (
                        <span key={tech} class="rounded-sm border border-site-border px-1.5 py-0 text-xs text-site-dim">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span
                      class={`inline-block rounded px-2 py-0.5 font-medium tracking-wider sm:hidden ${PROJECT_CATEGORY_TONE_CLASSES[project.category]}`}
                    >
                      {PROJECT_CATEGORY_LABELS[project.category]}
                    </span>
                    <time class="text-site-dim sm:hidden">{formatDate(new Date(project.date))}</time>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-site-blue hover:underline"
                      >
                        Live ↗
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-site-blue hover:underline"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>

                <div class="w-40 flex-col items-end gap-2 text-right max-sm:hidden flex">
                  <span
                    class={`inline-block rounded px-2 py-0.5 text-xs font-medium tracking-wider ${PROJECT_CATEGORY_TONE_CLASSES[project.category]}`}
                  >
                    {PROJECT_CATEGORY_LABELS[project.category]}
                  </span>
                  <time class="text-xs text-site-dim">{formatDate(new Date(project.date))}</time>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
