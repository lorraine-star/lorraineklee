# Editing Your Website: A Plain-Language Guide

A reference for Lorraine and the RISE Dream Team. This is the companion to the
two short walkthrough videos. The videos are the "watch once" tour. This doc is
the thing you keep open while you edit, so you can look up "where do I change
this?" and "how do I do that?" any time.

No coding or GitHub knowledge needed. If a step ever feels technical, it is
probably one of the few things flagged below as "leave this to the developer."

> **New here? Watch these first, in order.**
>
> 1. **Part 1, The Editor:** logging in, the dashboard, and making your first
>    edit (the home page hero).
>    https://www.loom.com/share/a7d48fe8ee074b01860ca90fe291d772
> 2. **Part 2, Going Live:** how a saved edit turns into a live change on the
>    site (the preview, approving it, and the roughly 60 second deploy).
>    https://www.loom.com/share/1e3b39cb37444cf6b4d539174e8cf449

---

## Table of contents

1. [How to log in](#1-how-to-log-in)
2. [Adding teammates](#2-adding-teammates)
3. [How editing and publishing works](#3-how-editing-and-publishing-works)
4. [Where everything lives (the lookup table)](#4-where-everything-lives-the-lookup-table)
5. [Common tasks, step by step](#5-common-tasks-step-by-step)
6. [Branded short links](#6-branded-short-links)
7. [The free course popup](#7-the-free-course-popup)
8. [What NOT to touch, and who to call](#8-what-not-to-touch-and-who-to-call)
9. [Where the old WordPress content lives](#9-where-the-old-wordpress-content-lives)
10. [Updating llms.txt (only when you add something notable)](#10-updating-llmstxt-only-when-you-add-something-notable)
11. [Quick glossary](#11-quick-glossary)

---

## 1. How to log in

Your website content is edited in a tool called **Keystatic**. You reach it by
adding `/keystatic` to the end of the site address:

> **https://lorraineklee.com/keystatic**

- Sign in with your **email**. You do **not** need a GitHub account or any
  developer login.
- The very first time, you will accept an email invitation, then log in. After
  that, you just go straight to the address above.
- Bookmark `lorraineklee.com/keystatic` so it is one click away.

If you land on a page asking for a GitHub login and you do not have one, stop
and contact your developer (see [section 8](#8-what-not-to-touch-and-who-to-call)).
You should be signing in with your email, not setting up a developer account.

---

## 2. Adding teammates

Your team edits through **Keystatic Cloud**. To let another team member edit:

1. Whoever manages the Keystatic Cloud account (your developer, to start) invites
   them by email from the Keystatic Cloud team settings.
2. The teammate accepts the email invite and signs in at
   `lorraineklee.com/keystatic`.

**Seat limit:** the free plan includes a small number of editor seats (3). If
the team grows past that, it needs a paid upgrade. If you want more editors than
the free plan allows, ask your developer to set that up rather than removing
someone who still needs access.

---

## 3. How editing and publishing works

This is the single most important thing to understand, so changes never feel
"broken" when they are actually just normal.

**Changes are not instant.** When you save an edit, the site rebuilds itself in
the background, then your change appears. That usually takes **about 60 seconds**.
Refreshing the page over and over in the first few seconds is normal to see
"nothing yet." Give it a minute.

The loop, start to finish:

1. **Edit** a field in Keystatic (a headline, an image, a link, and so on).
2. **Save.** Keystatic records your change. Part 1 of the video shows exactly
   what the save button looks like and what happens right after.
3. **Approve / publish the change.** A saved edit creates a small "change request"
   that gets approved to go live. Part 2 of the video walks through this and
   shows where to watch the build status.
4. **Wait about 60 seconds** for the site to rebuild.
5. **Refresh** the live page to see your change.

**A note on "branches" (Dev and Main).** In the dashboard you may see names like
**Dev** and **Main**. Think of **Main** as the live website and **Dev** as a safe
draft area. Edits do not affect the live site until they reach **Main**. If you
are ever unsure which one you are on, that is a fine moment to check with your
developer before publishing. The videos show this.

> **Tip:** If you want to preview a bigger change before it goes live, that is
> exactly what the Dev / preview flow in Part 2 is for. For small everyday edits
> (a word, a link, a photo), the save-and-wait loop above is all you need.

---

## 4. Where everything lives (the lookup table)

Keystatic is organized into two kinds of things:

- **Pages (Singletons):** one entry per page. Open it to edit that page's words,
  images, and buttons.
- **Lists (Collections):** a set of repeating items, like Articles or
  Testimonials. You add, edit, or remove items in the list.

Use this as your "I want to change X, so I edit Y" cheat sheet.

### Pages

| I want to change...                                              | Open this in Keystatic        | Lives at this web address            |
| --------------------------------------------------------------- | ----------------------------- | ------------------------------------ |
| The **home page** (hero, buttons, etc.)                         | **Home**                      | `/`                                  |
| The **About** page                                              | **About**                     | `/about`                             |
| The **Speaking** page                                           | **Speaking**                  | `/speaking`                          |
| The **Learn** hub (free email course block, LinkedIn resources) | **Learn**                     | `/learn`                             |
| The **Book** page                                               | **Book**                      | `/book`                              |
| The **Contact** page (emails, the contact form)                 | **Contact**                   | `/contact`                           |
| The **Thought Leadership** page                                 | **Thought Leadership**        | `/thought-leadership`                |
| The **Featured In** page intro and headings                     | **Featured In**               | `/featured-in`                       |
| The **Interviews** page intro and headings                      | **Interviews Page**           | `/interviews`                        |
| The **Courses** hub intro, rating, and "why" section            | **Courses Page**              | `/courses`                           |
| The **free 5-day course** landing page                          | **Free Course (Funnel)**      | `/from-invisible-to-influential`     |
| The **newsletter signup** landing page                          | **Subscribe (Newsletter)**    | `/subscribe`                         |
| The **Coaching** page                                           | **Coaching**                  | `/coaching`                          |
| The **Consulting** page                                         | **Consulting**                | `/consulting`                        |
| The **Media Kit** page                                          | **Media Kit**                 | `/media-kit`                         |
| The **Speaker Bio** page                                        | **Speaker Bio**               | `/speaker-bio`                       |
| The **Privacy Policy**                                          | **Privacy Policy**            | `/privacy-policy`                    |
| The **Terms and Conditions**                                    | **Terms and Conditions**      | `/terms-privacy-legal`               |

### Lists

| I want to add or change...                                          | Open this list in Keystatic | Where it shows up on the site                          |
| ------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------ |
| A **press or media feature** (Forbes, CNBC, etc.)                   | **Featured Appearances**    | The grid on the **Featured In** page                   |
| An **article**                                                      | **Articles**                | The **Articles** page and each article's own page      |
| A **LinkedIn Learning course**                                      | **LinkedIn Courses**        | The **Courses** page and the course block on **Learn** |
| A **keynote talk** (with its own page)                              | **Keynotes**                | The **Speaking** page and each keynote's own page      |
| An **interview Lorraine hosted** (leaders she interviewed)          | **Interviews**              | The "interviews" block on the **Interviews** page      |
| A **testimonial / review**                                          | **Testimonials**            | The **Testimonials** page (and home / speaking / courses if you tick the boxes) |
| A **branded short link** (like `/book`)                             | **Shortlinks**              | Redirects visitors, see [section 6](#6-branded-short-links) |

> **Two things named "Interviews," explained.** **Interviews Page** is the page
> itself (its headline, section intros, and the list of shows where Lorraine was
> a guest). The **Interviews** list (a Collection) is the people Lorraine has
> interviewed, like Chelsea Clinton. Same idea on **Featured In** and **Courses**:
> the page's headings live in the page entry, while the actual list of items
> lives in a separate Collection.

> **Heads up about the Thought Leadership page.** That page keeps its own built-in
> lists of appearances, press, articles, and interviews right inside the
> **Thought Leadership** entry. So you edit those teasers there, not in the
> shared Collections.

---

## 5. Common tasks, step by step

Every task ends the same way: **Save, wait about 60 seconds, refresh.** That last
part is left off below so it does not repeat ten times.

### Edit a headline

1. Open the page from the table above (for example, **Home**).
2. Find the section (usually **Hero** at the top).
3. Edit the headline field.
4. Save.

> **Why a headline is sometimes split into pieces.** Many headlines are broken
> into a plain part and an *italic accent* part (and sometimes a plain "tail"
> after it). For example: "Build real" + *"executive presence"* + "." Edit
> whichever piece holds the words you want to change. If you want the italic
> emphasis on different words, move the words between the plain and accent fields.

### Swap an image

1. Open the page (or list item) that has the image.
2. Find the image field (for example, **Hero image** or **Headshot**).
3. Remove the current image, then upload the new one.
4. Fill in the **alt text** field (a short description of the photo, used for
   accessibility and search). Always do this.
5. Save.

> Use a high-quality JPG or PNG. For hero images, leaving the field empty keeps
> the current default photo, so do not clear it unless you have a replacement.

### Add an article

1. Open the **Articles** list.
2. Click to create a new entry.
3. Fill in **Title**, **Date**, **Description**, and a **Hero image**.
4. Either write the article in the **Content** area, or, if it lives on another
   site, paste that link in **External URL**.
5. Save.

### Add or update a testimonial

1. Open the **Testimonials** list.
2. Create a new entry (or open an existing one to edit it).
3. Fill in the **Quote**, the **Author**, and their **Role / company**.
4. Choose the **Type** (client/organizer, event attendee, or course/student).
   This controls which section of the Testimonials page it appears in.
5. Optional: tick **Show on homepage**, **Show on speaking**, or **Show on
   courses** to feature it elsewhere. Use **Sort order** to move it up or down.
6. Save.

### Add a client logo (Speaking page)

1. Open the **Speaking** page.
2. Find the **Past clients** list.
3. Add the client's **name**. If you have a logo image URL, paste it in the logo
   field; otherwise the name shows as styled text.
4. Save.

> The row of press logos on the **home page** ("as seen in") is part of the site
> design rather than a simple list, so changing that specific strip is a
> developer task. The Speaking page client list above is the one you manage
> yourself.

### Update a button or link (a "CTA")

1. Open the page with the button.
2. Find the button, often labeled **Primary CTA**, **Secondary CTA**, or a
   section's **CTA**.
3. Change the **Label** (the words on the button) and/or the **URL** (where it
   goes). A URL can be internal, like `/book`, or a full external address, like
   `https://www.amazon.com/...`.
4. Save.

---

## 6. Branded short links

A short link is a clean, branded web address that forwards to a longer one, for
example `lorraineklee.com/book` sending people to a long Amazon link. These
replace the short links you used on WordPress.

**To create one:**

1. Open the **Shortlinks** list in Keystatic.
2. Create a new entry.
3. **Short path:** what comes after the slash, lowercase, no spaces, no leading
   slash. Example: `buy-the-book` makes `lorraineklee.com/buy-the-book`.
4. **Destination URL:** the full address it forwards to. Must start with
   `http://` or `https://`.
5. Leave **Active** ticked.
6. Optional **Note:** a label just for you (for example, "Amazon book listing").
   Visitors never see it.
7. Save. After the usual rebuild (about 60 seconds), the short link is live.

**To change where a link points:** edit the **Destination URL** and keep the same
**Short path**, so the branded address you already shared keeps working.

**To turn a link off without deleting it:** untick **Active**.

> **Important rule:** a short path cannot be the same as a real page. Names like
> `about`, `book`, `speaking`, `learn`, `contact`, and `articles` already belong
> to real pages, so if you use one as a short link it is ignored and the real
> page wins. Pick a distinct path, like `book-now` instead of `book`.

---

## 7. The free course popup

There is a popup on the site inviting visitors to join the **free 5-day email
course**. Anyone who signs up through it is added to the same email list as the
main course signup form.

**How often it shows (so it never feels spammy):**

- It appears **once per visitor**, after about 15 seconds on a page or once they
  have scrolled partway down, whichever comes first.
- If someone closes it without signing up, it stays hidden for about **7 days**.
- Once someone signs up, it **never shows them again**.
- It never appears on the free course pages themselves or the newsletter signup
  page, so it does not interrupt someone already signing up.

**Where its settings live:** the popup's wording and its timing rules are built
into the site's code, **not** in Keystatic, so there is no popup screen for you
to edit. To change the popup's text, the timing, or to turn it on or off, ask
your developer. It is a quick change for them; it is just not a self-serve one.

---

## 8. What NOT to touch, and who to call

Keystatic is built so that normal edits (words, images, links) are safe. A few
specific things can break the site or quietly break a form, so treat these with
care.

**Do not rename the "URL slug" on an existing list item.** Articles, Courses,
Keynotes, Interviews, Testimonials, and Featured Appearances each have a **slug**
(the short name in its web address). Old web addresses forward to those slugs, so
renaming one breaks existing links and search ranking. Adding brand new items is
totally fine. Just do not rename the slug on something that already exists.

**Be careful with the "form ID" fields.** A few fields hold the ID of a connected
form: the **Typeform form ID** on the Contact page, and the **Kit / ConvertKit
form ID** on the Subscribe and Learn pages. These connect your forms to the right
inbox and email list. Editing the surrounding words is safe; changing the ID
itself can send submissions to the wrong place or stop them. Only change an ID if
you are deliberately swapping in a different form.

**Do not delete a whole page entry, and do not empty a required field.** Edit the
contents, but do not remove the page itself.

**You will not see the site's code in Keystatic, and you do not need it.** If
someone points you at files, settings, or anything that is not inside the
Keystatic editor, that is developer territory. Leave it.

**The free course landing page copy is safe to edit.** Its signup form is wired up
behind the scenes in a way that your wording changes cannot break, so edit that
page's text freely.

**If something looks wrong, stop and call for help.** If a save fails, a preview
turns red, or a page looks broken after you publish, do not keep retrying or keep
editing. Note what you changed and contact:

> **Who to contact:** Ryan, your developer.
> _[Add Ryan's preferred email or Slack here before sharing this doc.]_

---

## 9. Where the old WordPress content lives

Your old WordPress site held some pages that did not move to the new site (for
example Portfolio, Mentorship, and the full Awards and Accolades history). All of
that content and its images are preserved in a permanent backup for you, separate
from the new site, so nothing was lost.

> **WordPress permanent archive (Dropbox):**
> https://www.dropbox.com/scl/fo/rhspglr0s2ypmlz5kslgf/AI-DnIp8UkGQckutqRQmq2g?rlkey=kd99lom9g1wnikbsuiillabfd&dl=0
>
> Folder: `lorraineklee-wordpress-permanent-archive-2026-05-29`

Keep this somewhere safe. It is yours regardless of the new website, and it is
your reference if you ever want to bring an old page back or look something up.

---

## 10. Updating llms.txt (only when you add something notable)

**What it is:** `llms.txt` is a small file at the root of your site
(`lorraineklee.com/llms.txt`) that points AI tools, like ChatGPT and Perplexity,
at your most important pages with a short description of each. It helps AI search
describe you accurately and send people to the right places.

**This is not routine upkeep.** You do not need to touch it for everyday edits.
The one time it is worth updating is when you publish a **significant new piece of
content** you specifically want AI search to surface: a major article, a notable
interview, or an important new page. Then you add one line pointing to it.

**How to update it:** this file lives in the site's code, **not** in Keystatic, so
there is no Keystatic screen for it. You have two options:

- **Easiest:** send your developer the new page's address and a one-sentence
  description, and ask them to add it to `llms.txt`. Because this is rare, this is
  perfectly reasonable.
- **Self-serve (optional):** the file can be edited directly on GitHub by anyone
  with access. Each line follows this simple pattern, grouped under headings like
  "Writing and media":

  ```
  - [Title of the page](https://lorraineklee.com/the-page/): One sentence about what it is.
  ```

  Add your new line in the section it best fits, keep the same format, and save.
  If you are not comfortable doing that, use the "easiest" option above.

---

## 11. Quick glossary

- **Keystatic:** the editor where you change the website's content. Reach it at
  `lorraineklee.com/keystatic`.
- **Singleton (Page):** a one-of-a-kind page you edit in place, like Home or About.
- **Collection (List):** a set of repeating items you add to, like Articles or
  Testimonials.
- **Slug:** the short name in a web address (the part after the last slash). Safe
  to set on new items; do not rename on existing ones.
- **CTA:** "call to action," meaning a button or link, made of a label (the words)
  and a URL (where it goes).
- **Deploy / rebuild:** the roughly 60 second process where the site updates after
  you save. Your change is live once it finishes.
- **Main vs Dev:** Main is the live site; Dev is a safe draft area. Edits go live
  when they reach Main.
