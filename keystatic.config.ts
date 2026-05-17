import { config, fields, collection, singleton } from '@keystatic/core';

// Phase 1 (CLI-40): local storage — the admin UI at /keystatic writes to the
// content files in this repo during `npm run dev`.
//
// Phase 2 (handoff): switch storage to Keystatic Cloud so Lorraine can edit
// without a GitHub account:
//   storage: { kind: 'cloud' },
//   cloud: { project: 'team-slug/project-slug' },
// The Keystatic Cloud project must be created at keystatic.com first.

const testimonialFields = {
  quote: fields.text({ label: 'Quote', multiline: true }),
  author: fields.text({ label: 'Author' }),
  title: fields.text({ label: 'Author title' }),
};

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/home/',
      schema: {
        hero_headline: fields.text({ label: 'Hero headline' }),
        hero_subheadline: fields.text({
          label: 'Hero subheadline',
          multiline: true,
        }),
        hero_image: fields.image({
          label: 'Hero image',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
        primary_cta_text: fields.text({ label: 'Primary CTA text' }),
        primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
        social_proof_logos: fields.array(
          fields.image({
            label: 'Logo',
            directory: 'public/images/logos',
            publicPath: '/images/logos/',
          }),
          { label: 'Social proof logos' }
        ),
        featured_testimonial: fields.object(testimonialFields, {
          label: 'Featured testimonial',
        }),
        testimonials: fields.array(fields.object(testimonialFields), {
          label: 'Testimonials',
          itemLabel: (props) => props.fields.author.value || 'Testimonial',
        }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/about/',
      format: { contentField: 'body' },
      schema: {
        headline: fields.text({ label: 'Headline' }),
        hero_image: fields.image({
          label: 'Hero image',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        headshot: fields.image({
          label: 'Headshot',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        pull_quote: fields.text({ label: 'Pull quote', multiline: true }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
    speaking: singleton({
      label: 'Speaking',
      path: 'src/content/speaking/',
      format: { contentField: 'intro_copy' },
      schema: {
        hero_image: fields.image({
          label: 'Hero image',
          directory: 'public/images/speaking',
          publicPath: '/images/speaking/',
        }),
        speaking_topics: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }),
          {
            label: 'Speaking topics',
            itemLabel: (props) => props.fields.title.value || 'Topic',
          }
        ),
        past_clients_logos: fields.array(
          fields.image({
            label: 'Logo',
            directory: 'public/images/clients',
            publicPath: '/images/clients/',
          }),
          { label: 'Past client logos' }
        ),
        testimonials: fields.array(fields.object(testimonialFields), {
          label: 'Testimonials',
          itemLabel: (props) => props.fields.author.value || 'Testimonial',
        }),
        speaking_numbers: fields.object(
          {
            count: fields.text({ label: 'Count' }),
            stat: fields.text({ label: 'Stat' }),
            label: fields.text({ label: 'Label' }),
          },
          { label: 'Speaking numbers' }
        ),
        intro_copy: fields.markdoc({ label: 'Intro copy' }),
      },
    }),
    learn: singleton({
      label: 'Learn',
      path: 'src/content/learn/',
      format: { contentField: 'hero_copy' },
      schema: {
        linkedin_learning_courses: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            url: fields.text({ label: 'URL' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }),
          {
            label: 'LinkedIn Learning courses',
            itemLabel: (props) => props.fields.title.value || 'Course',
          }
        ),
        stanford_blurb: fields.text({
          label: 'Stanford blurb',
          multiline: true,
        }),
        free_resource_cta: fields.object(
          {
            text: fields.text({ label: 'CTA text' }),
            url: fields.text({ label: 'CTA URL' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          },
          { label: 'Free resource CTA' }
        ),
        hero_copy: fields.markdoc({ label: 'Hero copy' }),
      },
    }),
    book: singleton({
      label: 'Book',
      path: 'src/content/book/',
      format: { contentField: 'description' },
      schema: {
        book_cover: fields.image({
          label: 'Book cover',
          directory: 'public/images/book',
          publicPath: '/images/book/',
        }),
        title: fields.text({ label: 'Title' }),
        subtitle: fields.text({ label: 'Subtitle' }),
        retailer_links: fields.array(
          fields.object({
            name: fields.text({ label: 'Retailer name' }),
            url: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Retailer links',
            itemLabel: (props) => props.fields.name.value || 'Retailer',
          }
        ),
        endorsements: fields.array(fields.object(testimonialFields), {
          label: 'Endorsements',
          itemLabel: (props) => props.fields.author.value || 'Endorsement',
        }),
        description: fields.markdoc({ label: 'Description' }),
      },
    }),
    contact: singleton({
      label: 'Contact',
      path: 'src/content/contact/',
      format: { contentField: 'copy' },
      schema: {
        headline: fields.text({ label: 'Headline' }),
        contact_email: fields.text({ label: 'Contact email' }),
        social_links: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform' }),
            url: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Social links',
            itemLabel: (props) => props.fields.platform.value || 'Link',
          }
        ),
        copy: fields.markdoc({ label: 'Copy' }),
      },
    }),
  },
  collections: {
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/articles/*/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        hero_image: fields.image({
          label: 'Hero image',
          directory: 'public/images/articles',
          publicPath: '/images/articles/',
        }),
        external_url: fields.text({ label: 'External URL' }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
