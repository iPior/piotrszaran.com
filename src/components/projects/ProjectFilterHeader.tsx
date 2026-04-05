interface Props {
  itemCount: number;
}

export default function ProjectFilterHeader({ itemCount }: Props) {
  return (
    <div class="flex items-baseline gap-3">
      <h2 class="text-lg font-semibold text-site-text">
        <span class="font-normal text-site-mauve">const</span>
        <span class="text-site-yellow"> projectList</span>
      </h2>
      <span class="text-xs text-site-dim">// {itemCount} items</span>
    </div>
  );
}
