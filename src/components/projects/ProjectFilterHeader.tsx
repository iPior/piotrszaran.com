interface Props {
  itemCount: number;
}

export default function ProjectFilterHeader({ itemCount }: Props) {
  return (
    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 class="text-base font-semibold text-site-text sm:text-lg">
        <span class="font-normal text-site-mauve">const</span>
        <span class="text-site-yellow"> projectList</span>
      </h2>
      <span class="text-xs text-site-dim">// {itemCount} items</span>
    </div>
  );
}
