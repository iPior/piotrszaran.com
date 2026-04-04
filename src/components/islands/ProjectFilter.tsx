/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

interface Project {
  id: string;
  title: string;
  date: string;
  category: 'freelance' | 'work' | 'personal';
  description: string;
  stack?: string[];
  thumbnail?: string;
  liveUrl?: string;
  githubUrl?: string;
  blogSlug?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  freelance: 'Freelance',
  work: 'Work',
  personal: 'Personal',
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  freelance: 'border-site-peach text-site-peach bg-site-peach/10',
  work: 'border-site-green text-site-green bg-site-green/10',
  personal: 'border-site-blue text-site-blue bg-site-blue/10',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>('all');

  const filtered =
    active === 'all' ? projects : projects.filter((p) => p.category === active);

  const categories = ['all', 'freelance', 'work', 'personal'];

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

      {/* Project grid */}
      {filtered.length === 0 ? (
        <p class="text-site-dim text-sm">No projects in this category.</p>
      ) : (
        <div class="grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <a
              key={project.id}
              href={`/projects/${project.id}`}
              class="block border border-site-border bg-site-surface rounded-lg p-5 hover:border-site-blue transition-colors"
            >
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  class="w-full h-40 object-cover rounded mb-4"
                  loading="lazy"
                />
              )}
              <div class="flex items-center gap-3 mb-2">
                <span
                  class={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${CATEGORY_BADGE_COLORS[project.category]}`}
                >
                  {CATEGORY_LABELS[project.category]}
                </span>
                <time class="text-xs text-site-dim">{formatDate(project.date)}</time>
              </div>
              <h3 class="font-semibold text-lg mb-1 text-site-text">{project.title}</h3>
              <p class="text-site-subtext text-sm mb-3">{project.description}</p>
              {project.stack && project.stack.length > 0 && (
                <div class="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} class="text-xs bg-site-surface-hover text-site-peach border border-site-border rounded px-2 py-0.5">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div class="flex gap-3 mt-3 text-xs text-site-blue">
                {project.liveUrl && <span>Live ↗</span>}
                {project.githubUrl && <span>GitHub ↗</span>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
