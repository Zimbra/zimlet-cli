# Agent instructions for zimlet-cli

This file is the starting point for agents working on the Zimlet toolchain, host
integration, Zimlet implementation, or documentation. It combines task rules with a
map of the focused references in this and the sibling repositories.

Guidance in `.agents/` is organized by purpose: **workflow** files describe task sequences,
**rules** specify requirements, **reference** explains how things work, **context** holds
generated data, and **scripts** and **prompts** keep that data current.

## Which rules to follow

| Task | Rules / workflow (follow) | References (read) |
|---|---|---|
| Write or update Zimlet documentation under `documentation/` | [write-doc.md](.agents/rules/write-doc.md), [doc-guide/types.md](.agents/rules/doc-guide/types.md), [doc-guide/style.md](.agents/rules/doc-guide/style.md), [doc-guide/finish.md](.agents/rules/doc-guide/finish.md), [doc-guide/claims.md](.agents/rules/doc-guide/claims.md), [doc-guide/examples.md](.agents/rules/doc-guide/examples.md), [doc-guide/media.md](.agents/rules/doc-guide/media.md), [doc-guide/accessibility.md](.agents/rules/doc-guide/accessibility.md), [slots.md](.agents/rules/doc-guide/slots.md) (slot pages), [zimlet-doc-verify](.agents/skills/zimlet-doc-verify/SKILL.md) (run commands and examples in a scratch project) | [Topic-to-file map](#topic-to-file-map), [zimlet-examples.md](../zm-modern-zimlets/.agents/reference/zimlet-examples.md) |
| Review Zimlet documentation under `documentation/` | [review-doc.md](.agents/rules/review-doc.md), [write-doc.md](.agents/rules/write-doc.md), [doc-guide/types.md](.agents/rules/doc-guide/types.md), [doc-guide/style.md](.agents/rules/doc-guide/style.md), [doc-guide/finish.md](.agents/rules/doc-guide/finish.md), [doc-guide/claims.md](.agents/rules/doc-guide/claims.md), [doc-guide/examples.md](.agents/rules/doc-guide/examples.md), [doc-guide/media.md](.agents/rules/doc-guide/media.md), [doc-guide/accessibility.md](.agents/rules/doc-guide/accessibility.md), [slots.md](.agents/rules/doc-guide/slots.md) (slot pages), [zimlet-doc-verify](.agents/skills/zimlet-doc-verify/SKILL.md) (run commands and examples in a scratch project) | [Topic-to-file map](#topic-to-file-map), [zimlet-examples.md](../zm-modern-zimlets/.agents/reference/zimlet-examples.md) |
| Write or change a Zimlet, or a Zimlet example | [authoring.md](.agents/rules/authoring.md), and the [creation workflow](.agents/workflow/create-zimlet.md), which lists the steps from reading the architecture and host behavior through building, packaging and deployment | [authoring.md](.agents/reference/authoring.md), [Topic-to-file map](#topic-to-file-map) |
| Serve a Zimlet from a dev server so the user can load it in the Modern UI | [launch-zimlet.md](.agents/workflow/launch-zimlet.md) | [cli-commands.md](.agents/reference/cli-commands.md#development-loading-no-packaging) |
| Package, version, or deploy a Zimlet | [packaging-deployment.md](.agents/rules/packaging-deployment.md) | [packaging-deployment.md](.agents/reference/packaging-deployment.md), [Zimlet monorepos](../zm-modern-zimlets/.agents/reference/zimlet-repositories.md) |

Before relying on the default template or a fact marked unverified, check
[zimlet-known-issues.md](../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md).

## Zimlet documentation
Use [write-doc.prompt.md](.agents/prompts/write-doc.prompt.md) for writing documentation. Use [review-doc.prompt.md](.agents/prompts/review-doc.prompt.md) for reviewing documentation. The Zimlet [registration patterns context](../zm-modern-zimlets/.agents/context/zimlet-patterns.yml) is kept in `zm-modern-zimlets`, with its [update prompt](../zm-modern-zimlets/.agents/prompts/update-reg-patterns.prompt.md) and scanner. The documentation site is in `documentation/` (Antora). Build it with `npm run build:docs` and preview it with `npm run preview:docs`. It is published at `https://zimbra.github.io/zimlet-cli`.

## Sibling repositories

These repositories are expected to be checked out as siblings in one parent folder.
Links below and in the topic map are relative to this repository.

```text
<parent>/
  zimlet-cli/                    build tool, packaging, overview
  zm-x-web/                      Modern UI host: runtime, context, slots
  zm-x-ui/                       Shared UI styles, variables and mixins
  zm-modern-zimlets/             Modern UI Zimlets for product features
  zm-cloudsuite-zimlets/         Modern UI Zimlets for service integrations
  zm-x-zimlet-template-default/  scaffold used by `zimlet create`
  zm-frontend-ai-skills/         shared agent skills
```

If a referenced sibling repository or file is missing, stop and tell the user which
repository to check out; do not guess its contents.

## Topic-to-file map

| Need | File | Owner repository |
|---|---|---|
| Architecture, actors, and flows | [.agents/reference/architecture.md](.agents/reference/architecture.md) | zimlet-cli |
| Write a Zimlet: package, template, factory, imports, localization, and styles | [.agents/reference/authoring.md](.agents/reference/authoring.md) | zimlet-cli |
| `zimlet` commands, webpack pipeline, and `zimlet.config.js` | [.agents/reference/cli-commands.md](.agents/reference/cli-commands.md) | zimlet-cli |
| Packaging, descriptor XML, admin configuration, server contract, deployment, and sideloader | [.agents/reference/packaging-deployment.md](.agents/reference/packaging-deployment.md) | zimlet-cli |
| Host side: runtime and loading, context and shims, `ZimletSlot` and `invokePlugin`, the slot catalog, verticals, and the codebase map | [zimlet.md](../zm-x-web/.agents/zimlet/reference/zimlet.md), which says which file to start from for each task | zm-x-web |
| Zimlet monorepo layout, tooling, and workflows | [zm-modern-zimlets/.agents/reference/zimlet-repositories.md](../zm-modern-zimlets/.agents/reference/zimlet-repositories.md) | zm-modern-zimlets |
| Translation of Zimlet strings | Repository `AGENTS.md` and `.agents/translation/config.yml`; the [translation skill](../zm-frontend-ai-skills/skills/zimbra-translation/SKILL.md) | zm-modern-zimlets, zm-cloudsuite-zimlets |
| Zimlet registration patterns and real Zimlet examples | [zm-modern-zimlets/.agents/reference/zimlet-examples.md](../zm-modern-zimlets/.agents/reference/zimlet-examples.md); data in [zm-modern-zimlets/.agents/context/zimlet-patterns.yml](../zm-modern-zimlets/.agents/context/zimlet-patterns.yml), refreshed with [zm-modern-zimlets/.agents/prompts/update-reg-patterns.prompt.md](../zm-modern-zimlets/.agents/prompts/update-reg-patterns.prompt.md) | zm-modern-zimlets |
| Known issues, gaps and stale areas (template, host, CLI, Zimlet repos, docs sources) | [zm-modern-zimlets/.agents/reference/zimlet-known-issues.md](../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md) | zm-modern-zimlets |
