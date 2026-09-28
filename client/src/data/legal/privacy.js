// Template — have this reviewed before relying on it legally

/**
 * Privacy Policy (/privacy). Written to match what the site actually does
 * (checked against client/src/components/ContactForm.jsx, server/src/
 * routes/leads.js, server/src/models/Lead.js, server/src/notify.js,
 * client/src/analytics.js, render.yaml and client/index.html). If any of
 * that changes — a new form field, a new provider, new cookies — update
 * this text and `lastUpdated`.
 *
 * Text markup, rendered by components/RichText.jsx:
 *   {email}   -> the business email from COMPANY (content.js), linked
 *   {company} -> COMPANY.name
 *   [label](url) -> a link (internal paths stay in the app)
 *   **bold**
 * Each section: { id (the #anchor), heading, blocks }. A block is a
 * paragraph string or { list: [strings] }.
 */
export const privacyPolicy = {
  meta: {
    path: '/privacy',
    title: 'Privacy Policy | Security Marketing Company',
    description:
      'How Security Marketing Company collects, uses and protects information submitted through its website, including analytics and your privacy rights.',
  },
  title: 'Privacy Policy',
  lastUpdated: 'September 26, 2026',
  intro: [
    '{company} (“we”, “us”, “our”) is a B2B digital marketing agency that works with security companies across the United States. This policy explains what information we collect through our website, how we use it, who we share it with and the choices you have.',
    'If you have a question about this policy or your information, email us at {email}.',
  ],
  sections: [
    {
      id: 'information-we-collect',
      heading: 'Information we collect',
      blocks: [
        '**Information you give us.** When you request a strategy call through a form on our website (on the home page or the Contact page), we collect:',
        {
          list: [
            'Your name',
            'Your company name',
            'Your work email address',
            'The service you are interested in',
            'Anything you choose to write in the optional “What do you need?” field',
          ],
        },
        'The form also includes a hidden field that helps us filter out automated spam. People using the form normally leave it empty.',
        'If you email us directly, we receive your email address and whatever you include in your message.',
        '**Information collected when you submit a form.** Our server records the date and time of your submission and your browser’s “user agent” (a short description of your browser and device type). It also uses your IP address briefly to limit repeated submissions and protect the form from abuse.',
        '**Information collected automatically when you browse.** We use Google Analytics 4 on our live website, which collects information about how the site is used. See [Analytics and cookies](#analytics-and-cookies) below. Like most websites, our hosting providers also keep standard technical logs (such as IP addresses and request times) to operate and secure the service.',
        '**Information stored in your browser.** After you submit a form, your browser keeps your first name in session storage for that browser tab, so the thank-you page can greet you by name. It is not sent to us and is cleared when you close the tab.',
      ],
    },
    {
      id: 'how-we-use-information',
      heading: 'How we use your information',
      blocks: [
        'We use the information described above to:',
        {
          list: [
            'Respond to your inquiry and schedule a strategy call',
            'Send you a confirmation email when you submit a form',
            'Prepare for and provide our services if you become a client',
            'Understand how visitors use our website so we can improve it',
            'Protect our website and forms from spam, fraud and abuse',
            'Comply with legal obligations and enforce our [Terms](/terms)',
          ],
        },
      ],
    },
    {
      id: 'where-your-information-goes',
      heading: 'Where your information goes',
      blocks: [
        'We use a small number of service providers to run our website and handle inquiries. They process information on our behalf and only as needed to provide their services to us:',
        {
          list: [
            '**Vercel** hosts our website.',
            '**Render** hosts the server that receives form submissions.',
            '**MongoDB Atlas** provides the database where form submissions are stored.',
            '**Resend** sends email notifications of new inquiries to our team, and the confirmation email we send to you.',
            '**Google** provides Google Analytics (see below) and the web fonts our pages use. Fonts are loaded from Google’s servers, which receive your IP address when a page loads.',
          ],
        },
        'We may also disclose information if we are required to by law, to protect our rights or the safety of others, or as part of a merger, acquisition or sale of our business, in which case this policy would continue to apply to your information.',
      ],
    },
    {
      id: 'no-sale-of-data',
      heading: 'We do not sell your information',
      blocks: [
        'We do not sell personal information, and we do not share it with third parties for targeted (cross-context behavioral) advertising. We do not use the information you submit through our forms to build advertising audiences.',
      ],
    },
    {
      id: 'analytics-and-cookies',
      heading: 'Analytics and cookies',
      blocks: [
        'Our live website uses Google Analytics 4, a web analytics service provided by Google LLC. Google Analytics uses cookies (small files stored in your browser, such as `_ga`) and similar technologies to collect information such as the pages you visit, how you arrived at our site, your approximate location based on your IP address, your device and browser type, and actions such as submitting a form. When a form is submitted, we record that it happened and which form was used — not what you wrote.',
        'We use this information in aggregate to understand how our website is used and to improve it. Google processes this information under its own terms and [Privacy Policy](https://policies.google.com/privacy). You can read more in [How Google uses information from sites or apps that use its services](https://policies.google.com/technologies/partner-sites).',
        'You can control cookies through your browser settings, including blocking or deleting them. You can also prevent Google Analytics from collecting data about your visits by installing the [Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout).',
        'We do not use advertising cookies on our website.',
      ],
    },
    {
      id: 'data-retention',
      heading: 'How long we keep information',
      blocks: [
        'We keep the information you submit for as long as we need it to respond to you and, if we work together, for the length of our business relationship. After that, we keep it only as long as reasonably necessary for our business records, to meet legal obligations or to resolve disputes, and then delete it.',
        'Analytics data is kept according to the retention settings in our Google Analytics account.',
      ],
    },
    {
      id: 'your-choices',
      heading: 'Access, correction and deletion',
      blocks: [
        'You can ask us to give you a copy of the personal information we hold about you, to correct it, or to delete it. Email {email} with your request. We may need to confirm your identity before acting on it, and we will respond within a reasonable time and within any period required by applicable law.',
        'You can also ask us to stop contacting you at any time by replying to one of our emails or writing to the same address.',
      ],
    },
    {
      id: 'us-state-privacy-rights',
      heading: 'U.S. state privacy rights',
      blocks: [
        'Residents of some U.S. states — including California, Virginia, Colorado, Connecticut and Utah — have rights under state privacy laws. Depending on where you live and whether a particular law applies to us, these may include the right to:',
        {
          list: [
            'Know what personal information we collect about you, and access it',
            'Correct inaccurate personal information',
            'Delete personal information',
            'Receive a copy of your personal information in a portable format',
            'Opt out of the sale of personal information, targeted advertising and certain profiling',
            'Not be treated differently for exercising any of these rights',
          ],
        },
        'As described above, we do not sell personal information or use it for targeted advertising.',
        'The categories of personal information we collect are described in [Information we collect](#information-we-collect): identifiers (such as your name and email address), professional information (your company and the service you are interested in), and internet activity information (such as how you use our website). We collect it from you directly and automatically through your browser, use it for the purposes in [How we use your information](#how-we-use-information), and disclose it only to the service providers listed above.',
        'To make a request, email {email} with “Privacy request” in the subject line. You may use an authorized agent to make a request on your behalf, and we may ask for proof of that authorization. If we decline your request, you can appeal by replying to our response. If you are not satisfied with the result of your appeal, you may contact your state attorney general.',
      ],
    },
    {
      id: 'security',
      heading: 'Security',
      blocks: [
        'We use reasonable technical and organizational measures to protect the information we hold, including encrypted connections to our website and access controls on our systems. No method of transmitting or storing information is completely secure, so we cannot guarantee absolute security.',
      ],
    },
    {
      id: 'children',
      heading: 'Children’s privacy',
      blocks: [
        'Our website and services are intended for businesses and are not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has given us personal information, contact us at {email} and we will delete it.',
      ],
    },
    {
      id: 'other-websites',
      heading: 'Links to other websites',
      blocks: [
        'Our website links to other websites, such as our social media profiles and Google’s opt-out tools. We are not responsible for the privacy practices of those websites, and we encourage you to read their privacy policies.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        'We may update this policy from time to time. When we do, we will change the “Last updated” date at the top of this page. If we make material changes, we will make them clear on this page.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact us',
      blocks: [
        'If you have questions about this policy or want to make a request about your information, contact {company} at {email}.',
      ],
    },
  ],
};
