# Editing Your Website: A Plain-Language Guide

A reference for Lorraine and the RISE Dream Team. This is the companion to the
two short walkthrough videos. The videos are the "watch once" tour. This doc is
the thing you keep open while you edit, so you can look up "where do I change
this?" and "how do I do that?" any time.

No coding or GitHub knowledge needed. If a step ever feels technical, it is
probably one of the few things flagged below as "leave this to the developer."

> **This guide covers your site's content: words, images, and links.** To
> change the **design** (colors, fonts, sizes, spacing, layout), use Claude
> instead. That has its own companion guide:
> [Changing Your Website's Design](DESIGN-EDITING-GUIDE.md).

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
4. [If a save fails](#4-if-a-save-fails)
5. [The kinds of things you can edit](#5-the-kinds-of-things-you-can-edit)
6. [Pages: one entry per page](#6-pages-one-entry-per-page)
7. [Lists: repeating items](#7-lists-repeating-items)
8. [Sitewide settings and shared sections](#8-sitewide-settings-and-shared-sections)
9. [Images: the one rule](#9-images-the-one-rule)
10. [Search settings (SEO title and description)](#10-search-settings-seo-title-and-description)
11. [Common tasks, step by step](#11-common-tasks-step-by-step)
12. [Branded short links](#12-branded-short-links)
13. [The free course popup](#13-the-free-course-popup)
14. [What NOT to touch, and who to call](#14-what-not-to-touch-and-who-to-call)
15. [Where the old WordPress content lives](#15-where-the-old-wordpress-content-lives)
16. [Updating llms.txt (only when you add something notable)](#16-updating-llmstxt-only-when-you-add-something-notable)
17. [Quick glossary](#17-quick-glossary)

---

## 1. How to log in

Your website content is edited in a tool called **Keystatic**. You reach it by
adding `/keystatic` to the end of the site address:

> **https://lorraineklee.com/keystatic**

- Sign in with your **Keystatic account**. During setup, Lorraine created this
  account and connected it to her own **GitHub** account. That GitHub connection
  is what lets the editor save your changes to the website. It is already done,
  so it is a one-time step you went through during onboarding, not something you
  redo each visit.
- After that first sign-in, you can usually go straight to the address above and
  start editing.
- Because the editor is connected to Lorraine's own account, your saved changes
  are attributed to your team rather than to the developer.
- Bookmark `lorraineklee.com/keystatic` so it is one click away.

If you ever get signed out and are not sure how to get back in, see
[section 14](#14-what-not-to-touch-and-who-to-call) for who to contact.

---

## 2. Adding teammates

The Keystatic project is connected to **Lorraine's own account** (she created it
and linked it to her GitHub during setup), so Lorraine is the owner who adds and
removes editors.

To add a team member:

1. Lorraine opens her **Keystatic Cloud team settings** and invites the person.
2. The teammate accepts the invitation and can then edit at
   `lorraineklee.com/keystatic`.

**Seat limit:** the free plan includes a limited number of editor seats (3). If
the team needs more editors than that, it requires a paid upgrade on Lorraine's
account rather than removing someone who still needs access.

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
draft area. Your everyday Keystatic saves publish to **Main**, the live site,
after the short rebuild. If you are ever unsure which one you are on, that is a
fine moment to check with your developer before publishing. The videos show this.

> **Tip:** If you want to preview a bigger change before it goes live, that is
> exactly what the Dev / preview flow in Part 2 is for. For small everyday edits
> (a word, a link, a photo), the save-and-wait loop above is all you need.

---

## 4. If a save fails

Saves almost always just work. When one does not:

1. **Reload the editor tab and try once more.** If the editor tab has been open
   a while (especially if a teammate edited in the meantime), it can be looking
   at a slightly out-of-date copy of the site. A reload fixes that.
2. **If the error mentions a "path" that "does not exist"** (the full message
   looks like *"A path was requested for deletion which does not exist"*), stop.
   This is the image-field gotcha described in
   [section 9](#9-images-the-one-rule). Retrying will not help; it needs the
   developer, and it is a quick fix for them.
3. **Anything else:** note which entry and field you were editing, leave it as
   it is, and email Ryan (see [section 14](#14-what-not-to-touch-and-who-to-call)).

There is also a safety net working for you in the background: every saved
change is automatically checked before the site rebuilds, so a bad save gets
flagged early instead of quietly breaking a page. If you get a failure you do
not understand, nothing is on fire. Just stop and send a note.

---

## 5. The kinds of things you can edit

Everything in the Keystatic editor is one of four kinds of items. Knowing which
kind you are looking at tells you how it behaves:

| Kind | What it is | Where in this guide |
| ---- | ---------- | ------------------- |
| **Pages** | One entry per page of the site. Open the entry, edit its words, images, and buttons. You cannot add or delete pages here, only edit them. | [Section 6](#6-pages-one-entry-per-page) |
| **Lists** | Repeating items you can add, edit, reorder, and delete: articles, testimonials, courses, keynotes, press features. | [Section 7](#7-lists-repeating-items) |
| **Sitewide settings and shared sections** | Things that appear on many pages at once (the menu, the footer, the logo strip, the book promo). Edit once and every page updates. | [Section 8](#8-sitewide-settings-and-shared-sections) |
| **Shortlinks** | Branded web addresses like `lorraineklee.com/book-now` that forward somewhere else. Technically a list, but they behave differently enough to get their own section. | [Section 12](#12-branded-short-links) |

---

## 6. Pages: one entry per page

**How to edit a page:**

1. Find the page in the left-hand menu of the editor (the names below match the
   menu) and open it.
2. Scroll to the section you want. Page entries are organized top to bottom in
   roughly the same order as the page itself: hero first, then the middle
   sections, then the final call to action.
3. Edit the field, then **Save** and wait the usual minute.

Every page entry works this way. The full set:

| Open this in Keystatic     | What it edits                                             | Lives at this web address        |
| -------------------------- | --------------------------------------------------------- | -------------------------------- |
| **Home**                   | The home page (hero, sections, buttons)                   | `/`                              |
| **About**                  | The About page                                            | `/about`                         |
| **Speaking**               | The Speaking page, including its talk cards and past-client logos | `/speaking`              |
| **Speaker Bio**            | The short speaker bio page                                | `/speaker-bio`                   |
| **Book**                   | The book page for *Unforgettable Presence®*               | `/book`                          |
| **Learn**                  | The Learn hub (free email course block, LinkedIn resources) | `/learn`                       |
| **Courses Page**           | The Courses hub's intro, rating, and "why" section        | `/courses`                       |
| **Interviews Page**        | The interviews page, including the **guest appearances** list and the Spotify podcast section | `/interviews` |
| **Testimonials Page**      | The Testimonials page's headline and section headings     | `/testimonials`                  |
| **Featured In**            | The Featured In page's intro and headings                 | `/featured-in`                   |
| **Thought Leadership**     | The Thought Leadership page and its built-in teaser lists | `/thought-leadership`            |
| **Contact**                | The Contact page (emails, the contact form)               | `/contact`                       |
| **Subscribe (Newsletter)** | The newsletter signup landing page                        | `/subscribe`                     |
| **Free Course (Funnel)**   | The free 5-day course landing page, plus the thank-you page shown after signup | `/from-invisible-to-influential` |
| **Coaching**               | The Coaching page                                         | `/coaching`                      |
| **Consulting**             | The Consulting page                                       | `/consulting`                    |
| **Privacy Policy**         | The privacy policy                                        | `/privacy-policy`                |
| **Terms and Conditions**   | The terms and conditions                                  | `/terms-privacy-legal`           |

Two more entries in the menu are sitewide rather than single pages, and are
covered in [section 8](#8-sitewide-settings-and-shared-sections):

- **Site Settings** (menu, announcement banner, footer, "As Seen In" logo strip)
- **Book Promo (global section)** (the shared "The Book" promo band)

> **One entry you can skip: Media Kit.** The media kit page is currently
> retired from the live site, so edits to that entry will not appear anywhere.
> If you want the page back, ask your developer to re-publish it first.

> **Pairs to know about.** A few pages come in a "page entry + list" pair: the
> page entry holds the headings and intro text, while the actual items live in
> a separate list. **Featured In** pairs with the **Featured Appearances** list,
> **Courses Page** pairs with **LinkedIn Courses**, and **Testimonials Page**
> pairs with **Testimonials**. Edit headings in the page entry; add or change
> items in the list.

---

## 7. Lists: repeating items

Lists (Keystatic calls them "collections") hold repeating items. Unlike pages,
you can **add** new entries and **delete** old ones, and each entry usually gets
its own card, or even its own page, on the site.

**How to work with any list:**

- **Add:** open the list, click to create a new entry, fill in the fields, save.
- **Edit:** open the entry, change the fields, save.
- **Reorder:** most lists have a **Sort order** or **Priority** number on each
  entry. Lower numbers appear first. Change the numbers to change the order on
  the site.
- **Delete:** open the entry and use its delete option. Deleting is permanent
  after the rebuild, so when in doubt, look for an on/off checkbox instead
  (Shortlinks and courses have one).

The full set:

| Open this list in Keystatic | What one entry is                                         | Where it shows up on the site |
| --------------------------- | --------------------------------------------------------- | ----------------------------- |
| **Testimonials**            | One quote with its author, role, and type                 | The **Testimonials** page, and the home / speaking / courses pages if you tick the boxes ([section 8](#8-sitewide-settings-and-shared-sections)) |
| **Articles**                | One article (written here, or a link to one elsewhere)    | The **Articles** page, and its own page if written here |
| **LinkedIn Courses**        | One LinkedIn Learning course card                         | The **Courses** page grid (grouped by category), and each course's own page |
| **Keynotes**                | One keynote talk with description, takeaways, and video   | Each keynote's own page under `/keynotes/` (old keynote links forward here) |
| **Featured Appearances**    | One press or media feature (Forbes, CNBC, a podcast, an award, and so on) | The grid on the **Featured In** page |
| **Shortlinks**              | One branded forwarding address                            | Nothing visible; it redirects visitors ([section 12](#12-branded-short-links)) |

> **Where did the "Interviews" list go?** Interviews where **Lorraine is the
> guest** (podcasts, shows, LinkedIn News segments) are edited inside the
> **Interviews Page** entry, in its **Guest appearances** list, not in a
> separate collection. And a notable interview can also be added to **Featured
> Appearances** (choose the "Interview" type) so it shows on the Featured In
> page.

> **Heads up about the Thought Leadership page.** That page keeps its own
> built-in teaser lists of appearances, press, articles, and interviews right
> inside the **Thought Leadership** entry. So you edit those teasers there, not
> in the shared lists.

> **Heads up about Speaking talks vs. Keynotes.** The talk cards shown on the
> **Speaking** page are edited inside the **Speaking** entry's own list, not in
> the **Keynotes** collection. The Keynotes collection is the catalog behind the
> individual keynote pages under `/keynotes/`.
>
> Because those are two separate entries, each talk's **description and
> takeaways live in both places**, and they can't update each other
> automatically. When you change a talk's description or takeaways, make the
> same edit twice: once on the talk's card inside the **Speaking** entry, and
> once in that talk's **Keynotes** entry. If you only edit one, the Speaking
> page and the keynote page will show different text.

---

## 8. Sitewide settings and shared sections

Some things appear on many pages but are edited in exactly **one** place. Edit
once, and every page that shows it updates together. That is by design, so the
site can never drift out of sync with itself.

**Site Settings** is the big one. It holds the site's shared "chrome":

- **Navigation:** the top menu items, their dropdowns, and the **Contact**
  button. (Each menu item has a small **ID** field. Leave existing IDs alone;
  they are how the site highlights the page you are on.)
- **Announcement banner:** the thin bar above the menu, with an on/off
  checkbox, its bold lead-in, text, and link.
- **Footer:** the tagline, social media links, the "Get in touch" block, the
  Explore links, and the legal line (the year updates by itself).
- **Press / "As Seen In" strip:** the scrolling row of outlet logos. It appears
  on the **home**, **about**, **featured-in**, and **speaking** pages, and all
  four read this one list.

**Book Promo (global section)** is the "The Book" promo band (cover, blurb,
endorsement quote, and the "Get your copy" button) that appears on the home
page. It is built as a shared section, so one edit updates it everywhere it is
shown.

**Testimonials are shared too.** There is a single Testimonials list. Each
entry has checkboxes: **Show on homepage carousel**, **Show on the
/testimonials page**, **Show on the /speaking page**, and **Show on the
/courses page**. Ticking boxes decides *where* a testimonial appears, but there
is still only one entry behind them, so **editing the quote changes it
everywhere it is shown**. If you want a different wording for a different page,
that is a new entry, not an edit.

---

## 9. Images: the one rule

> **Always add images by uploading them through the image field. Never type or
> paste a file path (like `/images/photo.jpg`) into an image field.**

The upload button stores the image in the right place automatically. A typed
path points at a file the editor cannot see, and the next save of that entry
fails with an error like *"A path was requested for deletion which does not
exist."* Once that happens, every save of that entry fails until the developer
fixes the field, so this one habit saves you a lot of trouble. (An automatic
check now catches this mistake early, but "upload, don't type" means you never
meet it at all.)

The rest of good image hygiene:

1. Find the image field (for example, **Hero image** or **Headshot**).
2. Remove the current image, then **upload** the new one. Use a high-quality
   JPG or PNG. You do not need to resize or crop first; the site handles that.
3. Fill in the **alt text** field (a short description of the photo, used for
   accessibility and search). Always do this.
4. Save.

> A couple of older fields, like the optional testimonial headshot, genuinely
> ask for a text path instead of an upload. Their labels say so ("image path").
> Those are developer territory; leave them empty or ask Ryan.

> For hero images, leaving the field empty keeps the current default photo, so
> do not clear one unless you have a replacement ready.

---

## 10. Search settings (SEO title and description)

Near the top of almost every page entry sit two fields:

- **SEO title:** the page's title in a Google result, in the browser tab, and
  when the page is shared on LinkedIn or other social sites.
- **SEO description:** the sentence or two shown under the title in a search
  result.

Two things to know:

- **Empty is fine.** Every page has a sensible built-in title and description.
  Only fill these in when you want to override them.
- **Short is better.** Keep a title under roughly 60 characters and a
  description to one or two sentences, or search results will cut them off.

Special cases:

- **Free Course (Funnel)** has a second pair of fields for its **thank-you
  page** (the page people land on right after signing up), so the two pages can
  say different things.
- **Thought Leadership** also holds the SEO fields for the **Authored
  Articles** page.
- **Book** is the one page without its own SEO fields; its title comes from the
  book's title and subtitle fields. Ask Ryan if you ever want it to differ.

---

## 11. Common tasks, step by step

Every task ends the same way: **Save, wait about 60 seconds, refresh.** That last
part is left off below so it does not repeat ten times.

### Edit a headline

1. Open the page from the table in [section 6](#6-pages-one-entry-per-page)
   (for example, **Home**).
2. Find the section (usually **Hero** at the top).
3. Edit the headline field.
4. Save.

> **Why a headline is sometimes split into pieces.** Many headlines are broken
> into a plain part and an *italic accent* part (and sometimes a plain "tail"
> after it). For example: "Build real" + *"executive presence"* + "." Edit
> whichever piece holds the words you want to change. If you want the italic
> emphasis on different words, move the words between the plain and accent fields.

### Swap an image

Follow the steps in [section 9](#9-images-the-one-rule). The short version:
upload through the field, never type a path, and always fill in the alt text.

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
4. Choose the **Type** (Client / organizer speaking, Event attendee, or Course /
   student review). This controls which section of the Testimonials page it
   appears in.
5. Optional: tick **Show on homepage**, **Show on speaking**, or **Show on
   courses** to feature it elsewhere. Use **Sort order** to move it up or down.
6. Save.

### Add a guest interview (Lorraine as the guest)

1. Open the **Interviews Page** entry (not a list; see
   [section 7](#7-lists-repeating-items)).
2. Find the **Guest appearances** list and add an item.
3. Fill in the **Show / host** (for example, "Think Fast Talk Smart") and the
   **Episode / segment title**.
4. If it is on YouTube, paste the video's **YouTube video ID** (the 11
   characters after `youtu.be/` in the share link). That gives the card its
   thumbnail and watch link. If it lives elsewhere, use the **Watch URL** field
   instead.
5. Optional: a one-line **Description**.
6. Save.

### Add a press or media feature (Featured In page)

1. Open the **Featured Appearances** list and create a new entry.
2. Fill in the **Title / headline**, the **Source / outlet** (for example,
   "Forbes"), and pick the **Appearance type** (Article, Podcast, Video,
   Interview, Award, and so on). The type sets the little chip on the card and
   the default button label.
3. Paste the **External URL** the card should open. If there is no public link
   (say, an award), leave it blank and tick **Needs content review**.
4. Optional: upload the **Outlet logo**, set **Priority / sort order** (lower
   numbers come first), or tick **Feature at the top** for a highlight card.
5. Save.

### Add a client logo (Speaking page)

1. Open the **Speaking** page.
2. Find the **Past clients** list and add an item (or open one to edit it).
3. Add the client's **name**.
4. Give it a logo one of two ways:
   - **Logo image (upload):** the easiest option, and it works for any brand
     whether or not its logo is on a CDN. Upload your file at any size.
   - **Logo image URL:** or paste a URL, such as a Brandfetch CDN link.

   If you do both, the uploaded image is used. Leave both empty and the client
   name shows as styled text instead.
5. Save.

### Add a press logo ("As Seen In" strip)

This is the scrolling row of outlet logos that appears on the home, about,
featured-in and speaking pages. All four read the same list, so you only edit it
once.

1. Open **Site Settings**.
2. Find **Press / "As Seen In" strip**, then the **Press logos** list.
3. Add an entry and fill in:
   - **Slug** - a short lowercase id like `cnn`. Pick one and leave it alone;
     it is what the site uses to remember any custom styling for that logo.
   - **Outlet name** - the full name, for example `Fast Company`. This is also
     what screen readers announce.
   - **Logo image** - upload the file.
4. Save.

**You do not need to resize or crop the logo before uploading.** Upload whatever
you have and the strip fits it to match the others automatically. A transparent
PNG or an SVG looks best, because a white or colored background box will show as
a rectangle behind the logo.

**If one logo still looks off**, use the **Size nudge** field on that entry. Leave
it at `1` for almost every logo. Compact square logos sometimes read a little
small next to the wide word-style ones, so try `1.3` to `1.5` for those. Go below
`1` if a logo looks too heavy. Change it, save, and check the page.

> Note: the logos are shown in grey and lighten to full color when you hover
> over them. That is intentional, so a colorful logo will look grey on the live
> site until you point at it.

### Update the menu or the announcement banner

1. Open **Site Settings**.
2. For the menu: edit **Navigation**. You can change labels, links, and
   dropdown items, and the **Contact** button's label and link. Leave each
   item's small **ID** field alone.
3. For the banner: edit **Announcement banner**. Untick **Show announcement
   banner** to hide it entirely, or update its bold lead-in, text, and link.
4. Save.

### Update a button or link (a "CTA")

1. Open the page with the button.
2. Find the button, often labeled **Primary CTA**, **Secondary CTA**, or a
   section's **CTA**.
3. Change the **Label** (the words on the button) and/or the **URL** (where it
   goes). A URL can be internal, like `/book`, or a full external address, like
   `https://www.amazon.com/...`.
4. Save.

---

## 12. Branded short links

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

## 13. The free course popup

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

## 14. What NOT to touch, and who to call

Keystatic is built so that normal edits (words, images, links) are safe. A few
specific things can break the site or quietly break a form, so treat these with
care.

**Never type a file path into an image field.** The single most common way a
save breaks. See [section 9](#9-images-the-one-rule).

**Do not rename the "URL slug" on an existing list item.** Articles, Courses,
Keynotes, Testimonials, and Featured Appearances each have a **slug** (the short
name in its web address or anchor). Old web addresses forward to those slugs, so
renaming one breaks existing links and search ranking. Adding brand new items is
totally fine. Just do not rename the slug on something that already exists.

**Leave small "ID" fields alone.** Menu items and press logos each carry a tiny
ID (like `speaking` or `cnn`). They connect the entry to styling and page
highlighting behind the scenes. Renaming one silently drops that connection.

**Be careful with the "form ID" fields.** A few fields hold the ID of a connected
form: the **Typeform form ID** on the Contact page, and the **Kit / ConvertKit
form ID** on the Subscribe page. These connect your forms to the right
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
editing. Follow [section 4](#4-if-a-save-fails), note what you changed, and
contact:

> **Who to contact:** Ryan, your developer, at **ryanflash166@gmail.com**.

---

## 15. Where the old WordPress content lives

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

## 16. Updating llms.txt (only when you add something notable)

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
  - [Title of the page](https://lorraineklee.com/the-page/): A short description of what it is.
  ```

  Add your new line in the section it best fits, keep the same format, and save.
  If you are not comfortable doing that, use the "easiest" option above.

---

## 17. Quick glossary

- **Keystatic:** the editor where you change the website's content. Reach it at
  `lorraineklee.com/keystatic`.
- **Page (Singleton):** a one-of-a-kind page you edit in place, like Home or
  About. One entry per page; you cannot add or delete pages, only edit them.
- **List (Collection):** a set of repeating items you add to, like Articles or
  Testimonials.
- **Shared section:** a block that appears on several pages (the menu, footer,
  logo strip, book promo, testimonials) but is edited in one place. One edit
  updates every page that shows it.
- **Slug:** the short name in a web address (the part after the last slash). Safe
  to set on new items; do not rename on existing ones.
- **SEO title / description:** the page's name and blurb as they appear in
  Google results, the browser tab, and social shares. Empty means "use the
  built-in default."
- **CTA:** "call to action," meaning a button or link, made of a label (the words)
  and a URL (where it goes).
- **Alt text:** the short written description saved with an image, read aloud by
  screen readers and used by search engines. Fill it in for every image.
- **Deploy / rebuild:** the roughly 60 second process where the site updates after
  you save. Your change is live once it finishes.
- **Main vs Dev:** Main is the live site; Dev is a safe draft area. Everyday
  Keystatic saves publish to Main.
