# Agent instructions for zimlet-cli

This file is the starting point for agents working on the Zimlet toolchain, host
integration, Zimlet implementation, or documentation. It combines task rules with a
map of the focused references in this and the sibling repositories.

Guidance in `.agents/` is organized by purpose: **workflow** files describe task sequences,
**rules** specify requirements, **reference** explains how things work, **context** holds
generated data, and **scripts** and **prompts** keep that data current.

## Which rules to follow

| Task                                                        | Rules / workflow (follow)                                                                                            | References (read)                                                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Write or update Zimlet documentation under `documentation/` | [write-doc.md](.agents/rules/write-doc.md)                                                                          | [Topic-to-file map](#topic-to-file-map), [zimlet-registration-patterns.md](.agents/reference/zimlet-registration-patterns.md)      |
| Review Zimlet documentation under `documentation/`          | [review-doc.md](.agents/rules/review-doc.md), [write-doc.md](.agents/rules/write-doc.md)                            | [Topic-to-file map](#topic-to-file-map), [zimlet-registration-patterns.md](.agents/reference/zimlet-registration-patterns.md)      |
| Write or change a Zimlet, or a Zimlet example               | [authoring.md](.agents/rules/authoring.md), [create-zimlet.md](.agents/workflow/create-zimlet.md)                   | [authoring.md](.agents/reference/authoring.md), [Topic-to-file map](#topic-to-file-map)                                            |
| Package, version, or deploy a Zimlet                        | [packaging-deployment.md](.agents/rules/packaging-deployment.md)                                                    | [packaging-deployment.md](.agents/reference/packaging-deployment.md), [Zimlet monorepos](.agents/reference/zimlet-repositories.md) |

Before relying on the default template or a fact marked unverified, check
[needs-attention.md](.agents/reference/needs-attention.md).

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
  zm-x-oauth-client/             OAuth client library used by cloud Zimlets
  zm-frontend-ai-skills/         shared agent skills
```

If a referenced sibling repository or file is missing, stop and tell the user which
repository to check out; do not guess its contents.

## Typical Zimlet development path

1. Understand the moving parts in [architecture.md](.agents/reference/architecture.md).
2. Follow the [Zimlet creation workflow](.agents/workflow/create-zimlet.md);
   use [authoring.md](.agents/reference/authoring.md) for implementation patterns and
   [the authoring rules](.agents/rules/authoring.md) for requirements.
3. Choose a registration pattern using
   [zimlet-registration-patterns.md](.agents/reference/zimlet-registration-patterns.md),
   and use it to find real Zimlet examples.
4. Check the host behavior relevant to the integration:
   - Read [runtime.md](../zm-x-web/.agents/zimlet/reference/runtime.md) for loading,
     lifecycle, and plugin registration.
   - Read [context-and-shims.md](../zm-x-web/.agents/zimlet/reference/context-and-shims.md)
     for host-provided context, shared libraries, and events.
   - Use [slot-behavior.md](../zm-x-web/.agents/zimlet/reference/slot-behavior.md)
     and the [slot catalog](../zm-x-web/.agents/zimlet/context/zimlet-slots.yml) to
     choose and understand an extension point.
   - For routes and tabs, read
     [Zimlet-driven verticals](../zm-x-web/.agents/zimlet/reference/verticals.md);
     use [built-in verticals](../zm-x-web/.agents/reference/verticals.md) and the
     [codebase map](../zm-x-web/.agents/reference/codebase-map.md) to identify the
     host area and its source.
5. Build and run locally using [cli-commands.md](.agents/reference/cli-commands.md),
   then load the Zimlet with the sideloader using
   [packaging-deployment.md](.agents/reference/packaging-deployment.md).
6. Package and deploy using
   [packaging-deployment.md](.agents/reference/packaging-deployment.md).

## Topic-to-file map

| Need                                                                                        | File                                                                                                                                                                                                                                                                                                                                                  | Owner repository                         |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Architecture, actors, and flows                                                             | [.agents/reference/architecture.md](.agents/reference/architecture.md)                                                                                                                                                                                                                                                                                | zimlet-cli                               |
| Ordered workflow for creating a Zimlet                                                       | [.agents/workflow/create-zimlet.md](.agents/workflow/create-zimlet.md)                                                                                                                                                                                                                                                                                 | zimlet-cli                               |
| Write a Zimlet: package, template, factory, imports, localization, and styles               | [.agents/reference/authoring.md](.agents/reference/authoring.md)                                                                                                                                                                                                                                                                                      | zimlet-cli                               |
| `zimlet` commands, webpack pipeline, and `zimlet.config.js`                                 | [.agents/reference/cli-commands.md](.agents/reference/cli-commands.md)                                                                                                                                                                                                                                                                                | zimlet-cli                               |
| Packaging, descriptor XML, admin configuration, server contract, deployment, and sideloader | [.agents/reference/packaging-deployment.md](.agents/reference/packaging-deployment.md)                                                                                                                                                                                                                                                                | zimlet-cli                               |
| Host-side Zimlet references and slot-catalog maintenance                                   | [AGENTS.md](../zm-x-web/.agents/zimlet/AGENTS.md)                                                                                                                                                                                                                                                                                                    | zm-x-web                                 |
| Host runtime: loading, iframe, lifecycle, plugin registry, and debugging                    | [runtime.md](../zm-x-web/.agents/zimlet/reference/runtime.md)                                                                                                                                                                                                                                                                                         | zm-x-web                                 |
| `zimletContext`, shimmed modules, `store.zimletRedux`, and app events                       | [context-and-shims.md](../zm-x-web/.agents/zimlet/reference/context-and-shims.md)                                                                                                                                                                                                                                                                     | zm-x-web                                 |
| `ZimletSlot` and `invokePlugin` contract                                                    | [slot-behavior.md](../zm-x-web/.agents/zimlet/reference/slot-behavior.md)                                                                                                                                                                                                                                                                             | zm-x-web                                 |
| Rules for documenting slots and `invokePlugin` extension points                             | [.agents/rules/slot-doc.md](.agents/rules/slot-doc.md)                                                                                                                                                                                                                                                                                                | zimlet-cli                               |
| All extension points (slots and `invokePlugin` keys)                                        | [zimlet-slots.yml](../zm-x-web/.agents/zimlet/context/zimlet-slots.yml)                                                                                                                                                                                                                                                                               | zm-x-web                                 |
| Zimlet-driven verticals, routes, and slugs                                                  | [verticals.md](../zm-x-web/.agents/zimlet/reference/verticals.md)                                                                                                                                                                                                                                                                                     | zm-x-web                                 |
| Built-in verticals and application source locations                                         | [verticals.md](../zm-x-web/.agents/reference/verticals.md), [codebase-map.md](../zm-x-web/.agents/reference/codebase-map.md)                                                                                                                                                                                                                          | zm-x-web                                 |
| Zimlet monorepo layout, tooling, and workflows                                              | [.agents/reference/zimlet-repositories.md](.agents/reference/zimlet-repositories.md)                                                                                                                                                                                                                                                                  | zimlet-cli                               |
| Translation of Zimlet strings                                                               | Repository `AGENTS.md` and `.agents/translation/config.yml`; the [translation skill](../zm-frontend-ai-skills/skills/zimbra-translation/SKILL.md)                                                                                                                                                                                                     | zm-modern-zimlets, zm-cloudsuite-zimlets |
| Registration patterns and real Zimlet examples                                              | [.agents/reference/zimlet-registration-patterns.md](.agents/reference/zimlet-registration-patterns.md); data in [.agents/context/zimlet-registration-patterns.yml](.agents/context/zimlet-registration-patterns.yml), refreshed with [.agents/prompts/update-registration-patterns.prompt.md](.agents/prompts/update-registration-patterns.prompt.md) | zimlet-cli                               |
| Authoring rules                                                                             | [.agents/rules/authoring.md](.agents/rules/authoring.md)                                                                                                                                                                                                                                                                                              | zimlet-cli                               |
| Packaging, versioning, and deployment rules                                                 | [.agents/rules/packaging-deployment.md](.agents/rules/packaging-deployment.md)                                                                                                                                                                                                                                                                        | zimlet-cli                               |
| Documentation rules and site                                                                | [.agents/rules/write-doc.md](.agents/rules/write-doc.md), [.agents/rules/review-doc.md](.agents/rules/review-doc.md), [documentation/](documentation/)                                                                                                                                                                                                | zimlet-cli                               |
| Run documentation commands and examples in a scratch project                                | [.agents/skills/zimlet-doc-verify/SKILL.md](.agents/skills/zimlet-doc-verify/SKILL.md)                                                                                                                                                                                                                                                                | zimlet-cli                               |
| Known gaps, stale areas, and items to confirm                                               | [.agents/reference/needs-attention.md](.agents/reference/needs-attention.md)                                                                                                                                                                                                                                                                          | zimlet-cli                               |
