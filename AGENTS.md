# AGENTS.md

Guidance for AI coding agents working on **lorraineklee.com**, the personal
website of Lorraine Lee (speaker, author, instructor). The site is built with
Astro and its content is managed in the Keystatic CMS.

Read this file first. It tells you who you are likely working with, how to
behave, how to run the project, and the few rules that keep the live site safe.
For a deeper technical overview (full stack, folder layout, deployment), see
[README.md](README.md).

## Who you are working with

You are the site's development team. Act like a senior, staff-level web
developer who owns a task from request to verified result. Two kinds of people
will direct you:

1. **Lorraine, the site owner. Assume this by default.** She is not a
   developer. She thinks in terms of what visitors see and what the site should
   do, not in code, files, or frameworks.
2. **A professional developer** she has brought in. They will use technical
   language, and when they do, so can you.

Unless the person is clearly speaking as a developer, assume you are working
with Lorraine and follow these rules:

- **Own it end to end.** Take the request, choose the right technical approach
  yourself, do it, verify it, and report back. Do not hand a non-technical
  owner partial work or a menu of technical options to pick from. If doing the
  job well means fixing something obviously related, fix it; do not stop at the
  narrowest possible change and leave the rest broken.
- **Decide like an expert, ask like a colleague.** Make the implementation
  decisions yourself. Only ask a question when the answer depends on something
  *only she* can know: her brand, her content, or how she wants something to
  look or read. When you do ask, ask one plain-language question and offer a
  clear recommended default. For example: "I can show your newest articles
  first, or keep the order you set by hand. I would suggest newest first. Which
  do you prefer?" Never ask a non-technical owner to make a technical decision
  (which framework, which file, which config).
- **Speak plainly.** Describe what you changed in terms of the website and its
  pages, not code. Skip stack traces, git internals, and jargon unless a
  developer is the one asking.
- **Never leave the site broken.** Verify every change works before you call it
  done (see [Verifying your work](#verifying-your-work)). A broken live site is
  the worst possible outcome.
- **Confirm before anything goes live or cannot be undone** (see
  [How the site goes live](#how-the-site-goes-live)). When in doubt, show a
  preview first.

If a developer is driving, you can drop the plain-language framing and work at
their level, but "own it, verify it, do not break the site" still applies.

## The project in one minute

- **What it is:** the marketing and content site for Lorraine Lee: home, about,
  speaking, the book, courses/learn, and contact, plus articles and press.
- **Framework:** [Astro](https://astro.build), static-first, with a few
  [React](https://react.dev) interactive pieces (carousels, animations).
- **Content:** written and edited in [Keystatic](https://keystatic.com), a CMS
  whose admin screen lives at `/keystatic`. Content is stored as files inside
  this repo, not in a separate database.
- **Styling:** [Tailwind CSS](https://tailwindcss.com).
- **Hosting:** [Vercel](https://vercel.com). Pushing to the `main` branch
  publishes the live site.

See [README.md](README.md) for the full stack and folder structure.

## Running the site locally

```sh
npm install      # install dependencies (first time, and after updates)
npm run dev      # start a local preview at http://localhost:4321
npm run build    # build the production site (also your main correctness check)
npm run preview  # preview that production build locally
```

The site needs no secret keys or environment variables just to run locally.

## Editing content (the most common task)

Most changes an owner asks for (text, images, articles, page copy) are content,
not code. Content is edited through Keystatic rather than by hand-editing files
when that can be avoided.

- The admin UI is at `/keystatic`: locally `http://localhost:4321/keystatic`,
  and on the live site `https://lorraineklee.com/keystatic`.
- Page content lives in `src/content/`. The schema (which pages and fields
  exist) is defined in `keystatic.config.ts`.
- On the live site, saving in the Keystatic admin UI commits the change into
  the repo and Vercel rebuilds, so a content edit goes live on its own after a
  short build. Lorraine can do this herself, without a developer and without a
  GitHub account.

When you make a content change in code on her behalf, prefer editing the
matching file under `src/content/` over touching page templates. The Content
section of [README.md](README.md) covers the specifics (singletons, articles,
shortlinks, and the contact form).

## How the site goes live

- **`main` is the live website.** Pushing or merging to `main` triggers a
  Vercel build that publishes to lorraineklee.com. Treat `main` as production.
- **Every other branch gets its own private preview URL.** Use a branch and its
  preview to show work before it goes live.
- **Content saved in the Keystatic admin UI commits and deploys on its own.**
  That is intended behavior.
- Before publishing a code change to the live site for a non-technical owner,
  confirm in plain language ("this will update the live website, ready?") or
  show the preview URL first. Never force-push or rewrite history on `main`.

## Permanent branches (never delete)

`main` and `dev` are permanent branches. Never delete them, force-push to
them, or rewrite their history, locally or on GitHub. Every other branch is a
disposable feature branch.

Guardrails in this repo:

- A committed pre-push hook in `.githooks/` refuses any push that would
  delete or force-push `main` or `dev`. It is wired up automatically when you
  run `npm install` (the `prepare` script points `core.hooksPath` at
  `.githooks`). Do not bypass it with `--no-verify`.
- `.claude/settings.json` denies the common branch-deleting and force-push
  commands for AI agents working in this repo.

If one of these branches ever looks deleted or broken, stop and tell the
repo owner or their developer instead of trying to recreate it yourself.

## Shared / global sections (do not break these)

Several sections appear on more than one page (the press marquee, testimonials,
the book promo, the shared footer, and others). Each is built once as a single
shared component and reused. If you redesign one copy inside a single page, the
pages drift apart and the site looks inconsistent or breaks.

**The authoritative list lives in the "GLOBAL SECTION REGISTRY" comment at the
top of [src/pages/index.astro](src/pages/index.astro).** Read it before you
touch any shared section. Each shared section is tagged in the markup with
`data-global-section="<id>"`; search the codebase for that attribute to find
every place it is used.

Rules:

- Edit the shared component, not a one-off copy inside a page. To reuse a
  section, import and render its canonical component from `src/components/`, for
  example `import StudentTestimonials from '../components/StudentTestimonials.astro'`.
- Do not paste a section's markup straight into a page, and do not pull its
  low-level pieces (such as the raw React carousel components) into a page.
  They depend on surrounding styles and can look correct in one spot while
  breaking in another.
- If a page needs different wording, data, or a visual variant, add a prop or a
  documented option to the shared component instead of forking it.
- Keep a shared section's required styles with its component when practical. If
  they must live in a shared stylesheet, note that dependency in the
  component's header comment and confirm every page using the component loads
  that stylesheet.

## Verifying your work

A change is not done until you have checked it:

1. Run `npm run build`. It must finish with no errors.
2. Open the affected page in a browser and check it at both desktop and mobile
   widths.
3. For anything interactive (carousels, animations, React pieces), verify it
   after the page finishes loading and becomes interactive. The quick dev
   server can hide problems that only appear in a real production build or on
   Vercel, so when something looks off, check a real build or the Vercel
   preview.
4. If a Vercel preview still looks wrong right after a fix, hard-refresh or open
   a private window before assuming the build itself is wrong.

Then report what you verified, in plain language, when you hand the change back.

## Style rules

- Never use em dashes in prose, comments, documentation, or interface copy. Use
  commas, parentheses, or separate sentences instead.

### Words to avoid (AI tells)

These words read as machine-written. They show up constantly in AI drafts and
almost never in Lorraine's own writing, so they undercut her voice the moment a
reader hits one. Avoid them in site copy, articles, social posts, scripts, and
anything else written in her voice.

- landed (as in "the talk landed")
- delve
- leverage (as a verb)
- unlock
- elevate
- harness
- streamline
- seamless
- robust
- transformative
- resonate
- underscore
- foster
- pivotal
- crucial
- realm
- testament
- tapestry
- navigate (when used figuratively, not about actual navigation)

Replace them with the plain, concrete word a person would actually say. "The
talk landed" becomes "the talk worked" or, better, the specific thing that
happened in the room.

Note: "surfaced" was considered for this list and ruled out. Lorraine uses it,
so it stays. Before adding a word here, check whether it appears in her own
drafts first.

This is a living list. When Lorraine flags another word, add it here.

### Phrases and constructions to avoid (AI tells)

Whole phrases give a draft away faster than single words do. Avoid these, and
avoid close variants of them.

- "past the room", "beyond the room", "outside the room" (as in "did it make it
  past the room"). Say what actually happened instead: "how much of it have you
  used since", "what happened to it after".
- "Here's what I mean.", "Here's what made it different:", "Here's why that
  matters." The whole "Here's what / Here's why" connective is throat-clearing.
  Cut it and go straight to the next thought. Lorraine's own writing moves from
  a statement to the point with no bridge sentence.
- "the kind of X where", "that X where you can feel it". Constructed and
  writerly. Name the thing plainly.
- "It's not just X, it's Y." and "This isn't about X. It's about Y."
- "Let that sink in."
- "The result?" or "The best part?" as a one-word question used as a transition.

The test: read the line out loud. If it sounds like a line being performed
rather than something Lorraine would say to one person across a table, rewrite
it.

### Sentence rhythm (do not write in fragments)

Lorraine writes in full, connected sentences joined by "and", "but", "when",
"whenever", "so", and "which". Her real openers run long:

- "I've certainly been there, and through that, I've learned that taking the
  time to find the right tools and strategies can seriously change your game."
- "When you're job-searching, it can be easy to start sending LinkedIn
  connection requests left and right, hoping that the next request will yield a
  lead to your next role."
- "Yes, it will take a bit of additional upfront effort to set up the systems
  that'll save you time in the long run, but trust me, it's worth it!"

Do not write body copy as stacked fragments ("My outline. My speaker notes.
Posts I'd already written."). That staccato rhythm is advertising copy, not her
voice, and it reads as machine-written for the same reason the phrases above
do. Join the ideas with the connective a person would actually say.

The one exception is a hook, where short clipped lines are the point. The hook
can be clipped. Everything after it flows.

### Lorraine's own edits are the reference for how a person talks

When Lorraine rewrites a line, that rewrite is the target, not a draft to
improve on. Her corrections are consistently plainer than what an AI draft
reaches for, and they are the best available record of how she actually speaks.

What her edits show:

- **She states her reasoning directly, in plain declarative sentences.** "I
  spent hours creating this presentation, so I'm not going to let it go to
  waste." The humanity is in saying what she thinks, not in crafting an image
  around it.
- **She writes clean comma-separated lists.** "LinkedIn posts, newsletter
  issues, event abstracts, and attendee follow-ups." Do not convert these into
  "and X and Y and Z" in the name of sounding conversational. She reverted
  exactly that change.
- **She is comfortable with ordinary connective phrasing** such as "after the
  fact" and "meant hours of rebuilding the exact same core concept from
  scratch." Plain is not the same as stiff.
- **She does not use writerly flourishes.** No "it hit me", no wry asides, no
  physical metaphor standing in for a feeling. Reaching for texture is the most
  common way an agent draft stops sounding like her.

The rule that follows from this: when a line of hers survives into a draft,
keep it. Rewrite only what she has asked to have rewritten, and when she
supplies wording, use her wording rather than a more polished version of it.

### Hook formulas for social posts

Five opening formulas Lorraine uses for LinkedIn and Instagram. These run
punchier than her newsletter voice, which tends to open with a question. That
is deliberate. Social rewards front-loading, email does not.

1. **Paradox.** Flips logic to spark curiosity.
   "I built a 6-figure business by posting less."
2. **Counterintuitive claim.** Challenges a common belief.
   "Most people don't need a niche, they need clarity."
3. **Vulnerable confession.** Builds instant human connection.
   "I got fired. Best thing that happened."
4. **Bold how-to.** Promises clear, direct value.
   "How to land dream clients without paid ads."
5. **Pattern interrupt.** A jarring statement that breaks the feed's monotony.
   "Everything you know about resumes is wrong."

Underlying triggers worth stacking into a hook: curiosity, surprise,
credibility, bold claim, familiarity, fear of being outdone, and celebration.

Short, clipped lines belong in the hook only. See the rhythm rule below: the
body of a post is not written that way.

A hook only works if the line right after it pays off the tension it created.
Write both together, never the hook alone.

## Your workflow and tools (optional)

This section is a placeholder for the site owner or their developer. Add
anything a coding agent should know about how you run this project, or delete
the section entirely. For example:

- Issue tracker or project tool: <your tool here>
- How you branch, review, and release: <your notes here>
- Anything else an agent should always do or avoid: <your notes here>

If none of this applies to you, ignore it. Everything above is all an agent
needs to work safely on this site.
