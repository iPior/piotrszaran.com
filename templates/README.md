# Project entries

Add an `.md` or `.mdx` file to `src/content/projects/`. The filename determines its `/projects/<slug>` route.

- Required metadata: `title`, `date`, `category` (`personal`, `work`, or `freelance`), and `description`.
- `featured: true` includes the entry in the Featured Projects spotlight. It still appears in the complete archive. The default is `false`.
- `depth: short` labels the entry as project notes and uses a compact detail layout. Start with `project-short-template.mdx`; the body may be a brief paragraph or omitted altogether.
- `depth: full` is the default for existing case studies. Use `project-highlight-template.mdx` for optional body structure; no minimum length or required sections are enforced.
- `stack`, `liveUrl`, and `githubUrl` are optional. `hidden: true` excludes an entry from public listings and generated routes, including the spotlight.

Featured status and depth are independent: a short entry can be featured, and a full case study can remain archive-only. Both sections retain newest-first ordering. Category filters apply to the complete archive; the curated spotlight stays visible.

Blogs remain a separate collection. A project does not need a blog post. Optionally add `blogSlug` to a project or `projectSlug` to a blog post to link to a related entry; each direction is configured independently. Draft or hidden posts are not linked publicly.

No changes to existing project bodies, slugs, or metadata are necessary when adopting these fields.

Validation: run `npm test`, `npx astro check`, then `npm run build` (sequentially, since Astro check and build share generated files). Run `node --test tests/projects-build.mjs` after the build to verify the spotlight, complete archive, ordering, routes, metadata, and filter controls in the generated HTML.
