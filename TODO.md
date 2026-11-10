# TODO

- [x] Kenya-wide positioning instead of "Kisumu based" (title, meta, OG, twitter, JSON-LD, sidebar, hero eyebrow, about, footer, README). `index.html`, `README.md`
- [x] Remove both new home CTA bands (open-to-work band, collaboration band). `index.html`
- [x] Add "Hire Me" button to topbar and to hero CTA row. `index.html`
- [x] Move topbar "Hire Me" to the start (right after brand) instead of the middle. `static/styles/main.css`, `index.html`
- [x] Split hero lead so the open-to-work sentence is its own second paragraph. `index.html`
- [x] Reorder services: SEO first, Branding second, Maintenance & Growth third; rename "Care & Growth" everywhere (card, select, FAQ, JSON-LD). `index.html`
- [x] Restore shared card hover recipe `scale(1.02)` + red glow on work/service/blog/journey/enquiry cards. `static/styles/main.css`
- [x] Remove the "DEV.to" cover placeholder for posts without images. `static/scripts/app.js`, `static/styles/main.css`
- [x] Fix blog card layout: cards without a cover image now size to their content (`grid-auto-rows: auto; align-items: start`), masonry grid via `repeat(auto-fill, minmax(270px, 1fr))`. `static/styles/main.css`
- [x] Regenerate OG cover with "CLIFFORD OTIENO" prominent instead of "DOC-SCRIPTER". `static/images/og-cover.jpg`
- [x] Bump asset cache-bust. `index.html`
- [x] Trim meta/OG descriptions to 152 chars so the "open to full-time roles" line survives truncation. `index.html`
- [x] Rewrite panel titles with stronger punchlines: home "I build technology that earns money.", blog "Practical insights from real builds.", contact "Let's work together." `index.html`
- [x] Add "Machine Learning" tag to the Twynon card and "full stack engineering" to the About paragraph. `index.html`
- [x] Fix reveal failsafe: it no longer unobserves or force-reveals off-screen elements, counters write their final value before animating, blog card indices no longer collide with the panel header, and keyboard focus reveals a pending element. `static/scripts/app.js`
- [x] Fix stat counters showing "0" when requestAnimationFrame is starved (final value written first + timeout safety net). `static/scripts/app.js`
- [x] Fix blog card reveal index colliding with panel header indices. `static/scripts/app.js`
- [x] Dedicated briefcase icon class for the topbar Hire Me button. `index.html`, `static/styles/main.css`
- [x] Fix topbar overflow at 320px so the menu button is not clipped; fix cramped bottom tab bar. `static/styles/main.css`
- [x] Raise `.eyebrow` contrast to `var(--cta-hover)` so it passes AA on `--bg-2`. `static/styles/main.css`
- [x] On narrow screens show the headline before the portrait and shrink both the headline and the two title sizes. `static/styles/main.css`
- [x] Mark `minimax-m3.1-flash` unreliable in `memory.md`; use the other verified nvidia models. `memory.md`
- [x] Verify in browser at 320px: no horizontal overflow on any panel, scroll-reveal still animates, counters reach final values, blog cards size to content, zero em dashes, Lighthouse 1.0 / 1.0 / 1.0.
- [x] Refactor hero layout: photo now below headline on mobile (flex column-reverse), tighten lead copy. `static/styles/main.css`, `index.html`
- [x] Fix blog card layouts with masonry grid. `static/styles/main.css`
- [x] Remove the CV paragraph from Experience panel (redundant with other contact options). `index.html`
- [x] Review social cover with theme palette, solid underline, no open-to-work text. `static/images/og-cover.jpg`, `index.html`
- [x] Add data modelling and project management to the About paragraph. `index.html`
- [x] Improve Experience CTA: better copy, WhatsApp/email CV options. `index.html`
- [x] Move Hire Me to primary CTA button on home page (top-ranking). `index.html`
- [x] Commit the batch with conventional commit messages and push to `origin/main`.
- [x] Replace hero headline with a hiring-manager-centred punchline: "I deploy products, not promises." `index.html`
- [x] About: let the portrait float inside the copy so the text wraps around it at its position (stacks above the text under 620px). `static/styles/main.css`
- [x] About: restore the "I build for real businesses" sentence and the open-to-full-time line, curly apostrophes. `index.html`
- [x] Experience: add the Zone01 Technical Project Manager & Full Stack Developer role. `index.html`
- [x] Experience: add the DataSeal Data Engineer role (data modelling, star/snowflake, ETL). `index.html`
- [x] Experience: add the KALRO ICT Assistant role and refresh the panel eyebrow/lead. `index.html`
- [x] Remove the DOC-SCRIPTER word from the brand lockup; the sidebar shows "Clifford Otieno" and the rail/topbar show the portrait mark only. `index.html`, `static/styles/main.css`
- [x] Rename the last two "Get a Quote" buttons (sidebar and topbar) to "Let's Talk". `index.html`
- [x] Verify: no overflow at 1440/1024/768/414/320, reveals still fire, zero em dashes, AI-tells checker CLEAN (0 RED / 0 WARN), then commit and push. 

**All tasks complete.** All pushed to `origin/main` (status: up to date).

**Commits pushed**:
1. `763ad70 chore: add agent workflow guidance and verified model notes`
2. `d8d2feb docs: refresh README, task list and model notes`
3. `7b2f214 chore: add agent workflow guidance and verified model notes` (original base)
4. `66959c6 docs: record the cover review in the task list`
5. `fa32c51 feat(brand): rebuild the social cover on the theme palette`
6. `df4f3bc fix(ui): keep scroll reveal alive and fit the shell at 320px`
7. `d554d87 feat(copy): sharpen page titles and widen the hire-me pitch`
8. `de14f55 refactor(ui): move hero photo below headline, tighten copy, fix blog card layouts`
9. `c9fe142 fix(responsive): blog grid uses true masonry with repeat(auto-fill)`

All pushed to `origin/main` (status: up to date).