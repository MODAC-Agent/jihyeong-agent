# Frontend

## Key files

```
lib/patterns/           → Individual pattern definitions (one file per pattern)
lib/patterns/index.ts   → Aggregates all patterns into the exported array
lib/types.ts            → Pattern, ChecklistItem, DesignSystem types
lib/build-preview-code.ts → Sandpack App wrapper generator (buildAppCode)
lib/sandpack-shadcn.ts  → shadcn/ui component stubs for Sandpack preview
components/SandpackPreview.tsx → Live preview component
  - DS_DEPS: dependency map per design system (add new DS packages here)
  - detectDeps(): scans code for known DS imports
  - hasShadcn / hasChakra: provider injection logic
components/CodeBlock.tsx → Code display + preview tab toggle
```
