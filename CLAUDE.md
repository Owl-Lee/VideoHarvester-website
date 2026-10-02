# Website maintenance

The publishing target is GitHub Pages, repository `Owl-Lee/VideoHarvester-website`.
The `.openai` configuration and Vinext Worker build are legacy rollback resources, not the current publishing workflow. Do not publish through Sites for routine website updates.

- Edit the existing website source; preserve English and Chinese content, screenshot previews, download links and accessibility.
- Run `pnpm build:pages`, then `node --test tests/static-pages.test.mjs` before delivery.
- Push authorized changes to `main` to trigger `.github/workflows/pages.yml`. Branch changes do not publish until merged into `main`.
- Verify the GitHub Actions deployment succeeds; a commit or successful local build alone does not prove publication.
- Update `TECHNICAL_LOG.md` with changes, tests and any unverified checks.
- The Windows application is in a separate repository. Website maintenance does not authorize application releases.

As of 2026-10-01, Pages is live at https://owl-lee.github.io/VideoHarvester-website/ . The custom domain cutover is still pending. Configure the Pages custom domain before changing Name.com DNS, rebuild for the new base path, then verify DNS and HTTPS before claiming the official domain is migrated.
