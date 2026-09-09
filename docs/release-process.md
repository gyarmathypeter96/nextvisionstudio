# Release source of truth

GitHub `main` is the source for the production Vercel project. The active
deployment and exact released commit are recorded in `release-manifest.json`.
Changes are reviewed and tested on a branch. Merging a release can trigger
Vercel, so production activation requires separate explicit approval.
