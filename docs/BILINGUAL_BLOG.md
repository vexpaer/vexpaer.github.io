# Bilingual blog posts (English default)

New posts can use the existing Hexo `source/_posts/` naming and tag conventions. No old articles are changed.

To opt into the inline GitHub README-like `eng | 中文` switch, write both languages in **one Markdown file** with the following front matter and a standalone language divider:

```markdown
---
title: "How Neurons Learn"
title_zh: "神经元如何学习"
date: 2026-10-23 12:00:00
tags:
  - readApaper
  - neuroscience
bilingual: true
---

English article starts here. Markdown, images and equations work normally.

![Illustration](/img/example.png)

<!-- BLOG_ZH -->

中文文章从这里开始。Markdown、图片和公式同样正常渲染。

![示意图](/img/example.png)
```

- **English is always the default** on page load, with the language switch at the beginning of the article.
- Both versions share **one post URL**, one blog-list entry, and the existing Hexo post naming and metadata. Switching hides/shows already-rendered HTML, avoiding a second page and external translation services.
- The `<!-- BLOG_ZH -->` divider must be written **on its own line**. Put the complete English article before it and the complete Chinese article after it.
- Front matter `title` should be the English title; `title_zh` supplies the Chinese reading-page title after switching. Existing posts without `bilingual: true` are unaffected.
- Butterfly generates its default table of contents from both language sections. To prevent incorrect/duplicate headings, the sidebar TOC is hidden on bilingual articles; normal articles retain their TOC.
- Keep figures, citations, key claims, and source acknowledgments equivalent across languages. Check rights/attribution for imported figures.
- Workflow: discuss the topic first; draft both languages; revise with the author; create a PR **only after author approval**. Do not merge automatically.

The editorial requirements and approval process are maintained in Notion: [School → 提示词 → blog](https://app.notion.com/p/401632b58d1e814fa2c6f9fadfdc9a1c).
