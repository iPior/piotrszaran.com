# Project entries

Add an `.md` or `.mdx` file to `src/content/projects/`. The filename determines its `/projects/<slug>` route.

- Required metadata: `title`, `date`, `category` (`personal`, `work`, or `freelance`), and `description`.
- `featured: true` includes the entry in the Featured work section at the top of `/projects` and on the homepage. It still appears in the complete archive. The default is `false`.
- `featuredOrder` (optional, a whole number from 1) sets the entry's position in Featured work: `1` comes first. Entries without it follow, newest first.
- `featuredSize` (optional, `large` or `small`) sets the card size. Large cards sit above small ones, each group in `featuredOrder`. If no entry is `large`, the first featured entry gets the large card. Both fields require `featured: true`.

  ```yaml
  featured: true
  featuredOrder: 1
  featuredSize: large
  ```

  Layout: one large card spans the full width; two or more sit two per row (with an odd count, the first spans the full width). Small cards use two or three columns, whichever leaves fewer cards alone on the last row.
- `depth: short` labels the entry as project notes and uses a compact detail layout. Start with `project-short-template.mdx`; the body may be a brief paragraph or omitted altogether.
- `depth: full` is the default for existing case studies. Use `project-highlight-template.mdx` for optional body structure; no minimum length or required sections are enforced.
- `stack`, `liveUrl`, and `githubUrl` are optional. `hidden: true` excludes an entry from public listings and generated routes, including Featured work.

Featured status and depth are independent: a short entry can be featured, and a full case study can remain archive-only. The complete archive is always newest first. Category filters apply to the complete archive; Featured work stays visible.

Blogs remain a separate collection. A project does not need a blog post. Optionally add `blogSlug` to a project or `projectSlug` to a blog post to link to a related entry; each direction is configured independently. Draft or hidden posts are not linked publicly.

No changes to existing project bodies, slugs, or metadata are necessary when adopting these fields.

Validation: run `npm test`, `npx astro check`, then `npm run build` (sequentially, since Astro check and build share generated files). Run `node --test tests/projects-build.mjs` after the build to verify the spotlight, complete archive, ordering, routes, metadata, and filter controls in the generated HTML.
