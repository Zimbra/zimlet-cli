# Workflow for creating a Zimlet

Use this workflow to create a Zimlet or a complete, runnable Zimlet example. Follow the
[authoring rules](../rules/authoring.md) throughout; this file gives the task sequence, while
the [authoring reference](../reference/authoring.md) explains the package structure and
implementation patterns.

1. Identify which Zimlet repository owns the feature. Use the [Zimlet monorepo guide](../../../zm-modern-zimlets/.agents/reference/zimlet-repositories.md)
   when the target repository is unclear.
2. Understand the moving parts and the host behavior and extension point required by the feature.
   Read [architecture.md](../reference/architecture.md) first. Then start from
   [zimlet.md](../../../zm-x-web/.agents/zimlet/reference/zimlet.md) and read the host files it names for
   the feature: loading and lifecycle, context and shared libraries, slot behavior and the slot catalog,
   routes and tabs, and the host area and its source. Check the relevant source callsite; never infer a
   slot's contract from its name alone.
3. Choose a registration pattern from
   [zimlet-examples.md](../../../zm-modern-zimlets/.agents/reference/zimlet-examples.md) and
   inspect a real example that uses it.
4. For a new Zimlet, scaffold from the default template only after applying the fixes in
   [known-issues.md](../reference/known-issues.md), or copy the closest existing
   Zimlet. For an existing Zimlet, preserve its repository conventions.
5. Implement the package and factory using the
   [authoring reference](../reference/authoring.md). Apply the rules for imports, JSX,
   localization, lifecycle, and registration in
   [authoring.md](../rules/authoring.md).
6. Build from the Zimlet project with `npm run build`; see [cli-commands.md](../reference/cli-commands.md)
   for the build and watch options. Testing rendered behavior requires a running Modern UI instance and
   the sideloader; see
   [development loading](../reference/cli-commands.md#development-loading-no-packaging).
7. When packaging, set `--zimbraXVersion` to a range compatible with the target Modern UI
   version. Follow the [packaging and deployment reference](../reference/packaging-deployment.md).
