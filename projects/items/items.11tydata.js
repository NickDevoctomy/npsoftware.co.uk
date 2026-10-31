// Projects. Each file is one project: front matter for the details, Markdown
// for the full write-up. They're collected as `collections.projects` for the
// projects page, and each gets its own page at /projects/<file name>/, so
// renaming a project file changes its URL.
export default {
  layout: "project",
  nav: "projects",
  eleventyComputed: {
    permalink: (data) => `/projects/${data.page.fileSlug}/`,
    title: (data) => data.title ?? data.name
  }
};
