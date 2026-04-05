import {
  PROJECT_CATEGORY_LABELS,
  type ProjectCategory,
} from '../../lib/projects';

export type FilterCategory = 'all' | ProjectCategory;

interface Props {
  active: FilterCategory;
  onChange: (category: FilterCategory) => void;
}

const CATEGORY_LABELS = {
  all: 'All',
  ...PROJECT_CATEGORY_LABELS,
} as const;

const categories: FilterCategory[] = ['all', 'freelance', 'work', 'personal'];

export default function ProjectCategoryFilters({ active, onChange }: Props) {
  return (
    <div class="flex flex-wrap justify-end gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
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
  );
}
