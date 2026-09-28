// Template — have this reviewed before relying on it legally

/**
 * Terms & Conditions (/terms). Same format and markup as privacy.js:
 * {email}, {company}, [label](url), **bold**; blocks are paragraph strings
 * or { list: [strings] }. Update `lastUpdated` whenever the text changes.
 */
export const termsPage = {
  meta: {
    path: '/terms',
    title: 'Terms & Conditions | Security Marketing Company',
    description:
      'The terms that apply to your use of the Security Marketing Company website, including information about our services, intellectual property and limitations.',
  },
  title: 'Terms & Conditions',
  lastUpdated: 'September 26, 2026',
  intro: [
    'These terms apply to your use of the {company} website. Please read them carefully. If you have a question about them, email us at {email}.',
  ],
  sections: [
    {
      id: 'acceptance',
      heading: 'Acceptance of terms',
      blocks: [
        'By accessing or using our website, you agree to these terms and to our [Privacy Policy](/privacy). If you do not agree, please do not use the website. If you use the website on behalf of a company, you confirm that you are authorized to accept these terms for that company.',
      ],
    },
    {
      id: 'use-of-the-website',
      heading: 'Use of the website',
      blocks: [
        'Our website provides information about our marketing services for security companies across the United States. You may use it for lawful purposes connected with learning about and contacting us. You agree not to:',
        {
          list: [
            'Use the website in any way that breaks applicable law',
            'Submit false or misleading information, or information about another person without their permission',
            'Attempt to gain unauthorized access to the website, our server or our systems',
            'Interfere with the website’s operation, including by introducing malicious code or overloading it with automated requests',
            'Copy or reuse the website’s content for commercial purposes without our written permission',
          ],
        },
      ],
    },
    {
      id: 'services-information',
      heading: 'Information about our services',
      blocks: [
        'Descriptions of our services on this website — including what is included, how we work, typical timelines, pricing information and examples — are provided for general information only. They are not an offer, a quote or a binding commitment, and they do not create a contract between you and us.',
        'Any engagement for our services is governed by a separate written agreement signed by both parties. If anything on this website conflicts with that agreement, the agreement controls. We may change the services we offer and how we describe them at any time.',
        'Screens and examples on the website labeled “Example illustration” show fictional companies and are not client work or results. Articles on our blog provide general information and are not legal, financial or other professional advice. Marketing results depend on many factors outside our control, and nothing on this website is a guarantee of any particular result.',
      ],
    },
    {
      id: 'intellectual-property',
      heading: 'Intellectual property',
      blocks: [
        'The website and its content — including text, graphics, logos, illustrations, design and code — are owned by {company} or its licensors and are protected by copyright, trademark and other laws. You may view and print pages for your own internal business use. You may not otherwise copy, modify, distribute or create works based on the website without our written permission.',
        'Other names and trademarks mentioned on the website, such as Google, belong to their respective owners and are used only to describe services.',
      ],
    },
    {
      id: 'user-submissions',
      heading: 'Information you submit',
      blocks: [
        'When you submit a form or contact us, you confirm that the information is accurate and that you are entitled to share it. We handle it as described in our [Privacy Policy](/privacy) and use it to respond to you.',
        'Please do not send confidential or sensitive information through our forms. If you send us ideas or suggestions, we may use them without any obligation to you.',
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Third-party links',
      blocks: [
        'The website may link to websites and services run by others, such as social media platforms and Google tools. We do not control and are not responsible for their content, policies or practices, and a link does not mean we endorse them. Your use of them is governed by their own terms.',
      ],
    },
    {
      id: 'disclaimers',
      heading: 'Disclaimers',
      blocks: [
        'The website and its content are provided “as is” and “as available”. To the fullest extent permitted by law, we make no warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement. We do not warrant that the website will be uninterrupted, error-free or free of harmful components, or that its content is complete or current.',
      ],
    },
    {
      id: 'limitation-of-liability',
      heading: 'Limitation of liability',
      blocks: [
        'To the fullest extent permitted by law, {company} will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue, data or business opportunities, arising out of or relating to your use of, or inability to use, the website — even if we have been advised of the possibility of such damages.',
        'To the fullest extent permitted by law, our total liability for any claim arising out of or relating to the website is limited to one hundred U.S. dollars (US$100). This section does not limit liability that cannot be limited under applicable law, and it does not apply to any separate written agreement for our services, which sets out its own terms.',
      ],
    },
    {
      id: 'indemnification',
      heading: 'Indemnification',
      blocks: [
        'You agree to defend, indemnify and hold harmless {company} and its owners, employees and contractors from any claims, losses, liabilities and expenses (including reasonable attorneys’ fees) arising out of your misuse of the website or your breach of these terms.',
      ],
    },
    {
      id: 'governing-law',
      heading: 'Governing law',
      blocks: [
        // To name a state later, change this to e.g. "...governed by the laws of the State of
        // <State> and applicable U.S. federal law, without regard to conflict of law rules" and
        // add where disputes are heard (e.g. "the state and federal courts in <County>, <State>").
        'These terms are governed by applicable U.S. federal and state law, without regard to conflict of law rules.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      blocks: [
        'We may update these terms from time to time. When we do, we will change the “Last updated” date at the top of this page. Your continued use of the website after changes are posted means you accept the updated terms.',
      ],
    },
    {
      id: 'general',
      heading: 'General',
      blocks: [
        'If any part of these terms is found to be unenforceable, the rest remains in effect. Our failure to enforce any part of these terms is not a waiver of our right to do so later.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact us',
      blocks: ['If you have questions about these terms, contact {company} at {email}.'],
    },
  ],
};
