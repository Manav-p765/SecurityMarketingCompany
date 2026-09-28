import { blogPage, COMPANY } from '../data/content.js';
import { absoluteUrl } from '../seo.js';
import { postPath, posts } from './posts.js';

/** Per-post meta for usePageMeta and prerender.js. */
export const postMeta = (post) => ({
  path: postPath(post),
  title: `${post.title} | ${COMPANY.name}`,
  description: post.excerpt,
  ogType: 'article',
});

const publisher = {
  '@type': 'Organization',
  name: COMPANY.name,
  url: COMPANY.siteUrl,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/logo/logo-horizontal.png') },
};

const imageFor = (post) => absoluteUrl(post.coverImage || '/logo/logo-horizontal.png');

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
        dateModified: post.date,
        articleSection: post.category,
        author: { '@type': 'Organization', name: post.author, url: COMPANY.siteUrl },
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
