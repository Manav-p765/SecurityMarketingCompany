import { blogPage, COMPANY } from '../data/content.js';
import { absoluteUrl } from '../seo.js';
import { authorPath, postPath, posts, postsBy } from './posts.js';

/**
 * Per-post meta for usePageMeta and prerender.js. The optional SEO title and
 * description set in the admin replace the defaults (title + site name,
 * and the excerpt).
 */
export const postMeta = (post) => ({
  path: postPath(post),
  title: post.seoTitle || `${post.title} | ${COMPANY.name}`,
  description: post.seoDescription || post.excerpt,
  ogType: 'article',
});

const publisher = {
  '@type': 'Organization',
  name: COMPANY.name,
  url: COMPANY.siteUrl,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/logo/logo-horizontal.png') },
};

// Cover images uploaded in the admin are full Cloudinary URLs.
const imageFor = (post) =>
  post.coverImage && /^https?:\/\//.test(post.coverImage)
    ? post.coverImage
    : absoluteUrl(post.coverImage || '/logo/logo-horizontal.png');

/** Cloudinary photos are full URLs; the team author's fallback is a site path. */
const absolute = (url) => (/^https?:\/\//.test(url) ? url : absoluteUrl(url));

/**
 * The author as a schema.org node: a Person, or an Organization for the
 * team author. `url` is their author page; `sameAs` their social links.
 */
export function authorNode(author) {
  const sameAs = [author.links.linkedin, author.links.x, author.links.website].filter(Boolean);
  return {
    '@type': author.isTeam ? 'Organization' : 'Person',
    '@id': `${absoluteUrl(authorPath(author))}#author`,
    name: author.name,
    url: absoluteUrl(authorPath(author)),
    ...(author.role && !author.isTeam && { jobTitle: author.role }),
    ...(author.bio && { description: author.bio }),
    ...(author.photo && { image: absolute(author.photo) }),
    ...(sameAs.length && { sameAs }),
  };
}

/** Meta for /blog/author/:slug. */
export const authorMeta = (author) => {
  const fill = (text) => text.replace('{name}', author.name);
  const bio = author.bio.replace(/\s+/g, ' ');
  const short = bio.length > 160 ? `${bio.slice(0, 157).replace(/\s+\S*$/, '')}…` : bio;
  return {
    path: authorPath(author),
    title: fill(blogPage.author.metaTitle),
    description: short || fill(blogPage.author.metaDescription),
    ogType: 'profile',
  };
};

/** ProfilePage (about the Person/Organization) + BreadcrumbList for /blog/author/:slug. */
export function authorSchema(author) {
  const url = absoluteUrl(authorPath(author));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        url,
        name: authorMeta(author).title,
        inLanguage: 'en-US',
        mainEntity: authorNode(author),
        hasPart: postsBy(author).map((post) => ({
          '@type': 'Article',
          headline: post.title,
          url: absoluteUrl(postPath(post)),
          datePublished: post.date,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          ['Home', '/'],
          [blogPage.breadcrumb, blogPage.meta.path],
          [author.name, authorPath(author)],
        ].map(([name, path], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: absoluteUrl(path),
        })),
      },
    ],
  };
}

/** Article + BreadcrumbList for /blog/:slug. */
export function postSchema(post) {
  const url = absoluteUrl(postPath(post));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        articleSection: post.category,
        author: authorNode(post.author),
        publisher,
        image: imageFor(post),
        mainEntityOfPage: url,
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          ['Home', '/'],
          [blogPage.breadcrumb, blogPage.meta.path],
          [post.title, postPath(post)],
        ].map(([name, path], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: absoluteUrl(path),
        })),
      },
    ],
  };
}

/** Blog schema for /blog, listing every post. */
export function blogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${absoluteUrl(blogPage.meta.path)}#blog`,
    name: blogPage.hero.title,
    description: blogPage.meta.description,
    url: absoluteUrl(blogPage.meta.path),
    publisher,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absoluteUrl(postPath(post)),
      datePublished: post.date,
    })),
  };
}
