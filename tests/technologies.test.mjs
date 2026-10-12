import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { test } from "node:test";
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";

// Node runs the TypeScript directly; mirror Vite's raw SVG imports without a server.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith("./") &&
      !specifier.split("/").at(-1).includes(".")
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".svg?raw")) {
      const svg = readFileSync(new URL(url), "utf8");
      return {
        format: "module",
        source: `export default ${JSON.stringify(svg)};`,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const registry = await import("../src/lib/technologies.ts");
const icons = await import("../src/lib/techIcons.ts");
const badges = await import("../src/lib/techBadges.ts");

test("aliases, capitalization, and whitespace resolve consistently in both renderers", () => {
  for (const technology of registry.TECHNOLOGIES) {
    for (const alias of [technology.name, ...(technology.aliases ?? [])]) {
      const input = ` ${alias.toUpperCase()} `;
      assert.equal(registry.getTechnology(input), technology);
      assert.deepEqual(
        icons.getIconSources(input),
        icons.getIconSources(technology.name),
      );
      const query = new URL(badges.getShieldSrc(input, "123456", "mapped"))
        .search;
      assert.equal(
        query,
        new URL(badges.getShieldSrc(technology.name, "123456", "mapped"))
          .search,
      );
    }
  }
});

test("every project stack entry has a registered icon", async () => {
  for (const file of await readdir("src/content/projects")) {
    const content = await readFile(`src/content/projects/${file}`, "utf8");
    const stack = content.match(/^stack: \[(.*)\]/m)?.[1];
    if (!stack) continue;
    for (const entry of stack.split(",")) {
      const name = entry.trim().replace(/^["']|["']$/g, "");
      assert.ok(registry.getTechnology(name), `${file}: ${name}`);
      const sources = icons.getIconSources(name);
      assert.ok(sources.primary || sources.fallback, `${name} has no icon`);
    }
  }
});

test("custom icons exist and embedded badge logos match their source SVGs", async () => {
  for (const technology of registry.TECHNOLOGIES) {
    if (technology.customIcon) await access(`public${technology.customIcon}`);
    if (technology.badgeLogo?.startsWith("data:")) {
      const svg = Buffer.from(
        technology.badgeLogo.split(",")[1],
        "base64",
      ).toString("utf8");
      assert.equal(
        svg,
        await readFile(`public${technology.customIcon}`, "utf8"),
      );
      const url = new URL(
        badges.getShieldSrc(technology.name, "000000", "mapped"),
      );
      assert.equal(url.searchParams.get("logo"), technology.badgeLogo);
    }
  }
});

test("unknown technologies retain readable fallbacks and safe badge labels", () => {
  assert.equal(registry.getTechnology("Unknown & Tech"), undefined);
  assert.deepEqual(icons.getIconSources("Unknown & Tech"), {
    primary: null,
    fallback: null,
    fallbackTemplate: null,
  });
  assert.equal(icons.getMonogram("Unknown & Tech"), "UT");
  assert.equal(icons.getMonogram(""), "?");
  const url = new URL(
    badges.getShieldSrc("Unknown & Tech", "123456", "mapped"),
  );
  assert.equal(url.searchParams.get("logo"), null);
  assert.ok(url.pathname.includes("Unknown%20%26%20Tech"));
});

test("theme templates, tile backgrounds, and Bun brand colors are preserved", () => {
  const sources = icons.getIconSources("MDX");
  assert.equal(
    sources.fallbackTemplate,
    `https://cdn.simpleicons.org/mdx/${icons.THEME_SIMPLE_ICON_COLOR_PLACEHOLDER}`,
  );
  assert.equal(icons.getIconBgClass(" openai ", true), "sm:bg-black");
  assert.equal(icons.getIconBgClass("Unknown"), "bg-site-surface-hover");
  const mapped = new URL(badges.getShieldSrc("Bun", "111827", "mapped"));
  const uniform = new URL(
    badges.getShieldSrc("Bun", badges.THEME_COLOR_PLACEHOLDER, "uniform"),
  );
  assert.equal(mapped.searchParams.get("logoColor"), null);
  assert.equal(uniform.searchParams.get("logoColor"), "ffffff");
  assert.ok(uniform.pathname.includes(badges.THEME_COLOR_PLACEHOLDER));
  assert.equal(
    icons.getIconSources("Preact").fallback,
    "https://cdn.simpleicons.org/preact",
  );
});
