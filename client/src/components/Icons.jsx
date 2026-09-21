/**
 * Flat line icons drawn to a 24px grid — no 3D, no gradients, no emoji.
 * All inherit `currentColor` so the red/white hover states come from CSS.
 */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

/* --- Service icons -------------------------------------------------------- */

export function IconSearch() {
  return (
    <svg {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
      <path d="M7.5 12.5v-2M10.5 12.5v-4M13.5 12.5v-6" />
    </svg>
  );
}

export function IconBrowser() {
  return (
    <svg {...base}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M6 6.5h.01M8.5 6.5h.01M11 6.5h.01" />
      <path d="M7 13h7M7 16h4" />
    </svg>
  );
}

export function IconStore() {
  return (
    <svg {...base}>
      <path d="M4 9h16l-1 11H5L4 9Z" />
      <path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </svg>
  );
}

export function IconChart() {
  return (
    <svg {...base}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 20v-5M12.5 20v-9M17 20v-6" />
      <path d="m8 12 4.5-5L17 4" />
    </svg>
  );
}

export const SERVICE_ICONS = {
  seo: IconSearch,
  wordpress: IconBrowser,
  shopify: IconStore,
  marketing: IconChart,
};

/* --- Audience / industry icons ------------------------------------------- */

export function IconGuard() {
  return (
    <svg {...base}>
      <circle cx="12" cy="7" r="3.25" />
      <path d="M5.5 20v-1.5A5.5 5.5 0 0 1 11 13h2a5.5 5.5 0 0 1 5.5 5.5V20" />
      <path d="M9.5 13.5 12 16l2.5-2.5" />
    </svg>
  );
}

export function IconCamera() {
  return (
    <svg {...base}>
      <path d="M3 7.5 16 4.5l1.5 5L4.5 12.5 3 7.5Z" />
      <path d="M17.5 9.5 21 8.2v4.6l-3.5-1.3" />
      <path d="M7 12v4.5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V11" />
    </svg>
  );
}

export function IconAccess() {
  return (
    <svg {...base}>
      <rect x="3" y="4.5" width="12" height="15" rx="1.5" />
      <path d="M11.5 12h.01" />
      <path d="M17 9.5h4" />
      <path d="M19 9.5v10" />
      <path d="M19 13h2.5M19 16h2" />
    </svg>
  );
}

export function IconCyber() {
  return (
    <svg {...base}>
      <path d="M12 3.5 5 6.2v5.4c0 4 2.9 7.5 7 8.9 4.1-1.4 7-4.9 7-8.9V6.2L12 3.5Z" />
      <rect x="9.5" y="11" width="5" height="4" rx="0.75" />
      <path d="M10.75 11V9.75a1.25 1.25 0 0 1 2.5 0V11" />
    </svg>
  );
}

export const AUDIENCE_ICONS = {
  guarding: IconGuard,
  cctv: IconCamera,
  access: IconAccess,
  cyber: IconCyber,
};

/* --- UI icons ------------------------------------------------------------- */

export function IconLock() {
  return (
    <svg {...base} width="10" height="10" strokeWidth={2.25}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconSearchSmall() {
  return (
    <svg {...base} width="12" height="12" strokeWidth={2.25}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </svg>
  );
}

export function IconCheckSmall() {
  return (
    <svg {...base} width="15" height="15" strokeWidth={2.5}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconPlus() {
  return (
    <svg {...base} width="16" height="16" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconArrowRight() {
  return (
    <svg {...base} width="18" height="18">
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg {...base} width="28" height="28" strokeWidth={2}>
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconAlert() {
  return (
    <svg {...base} width="15" height="15" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.25h.01" />
    </svg>
  );
}

/* --- Social icons (solid glyphs) ----------------------------------------- */

const brand = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
};

export function IconLinkedIn() {
  return (
    <svg {...brand}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.3 8.65 22 11.1 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21h-4V9Z" />
    </svg>
  );
}

export function IconX() {
  return (
    <svg {...brand}>
      <path d="M17.3 3h3.3l-7.2 8.2L21.8 21h-6.6l-5.2-6.7L3.9 21H.6l7.7-8.8L.4 3h6.8l4.7 6.2L17.3 3Zm-1.2 16h1.8L7.9 4.8H6L16.1 19Z" />
    </svg>
  );
}

export function IconInstagram() {
  return (
    <svg {...brand}>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.55.21.95.47 1.36.88.41.41.67.81.88 1.36.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.21.55-.47.95-.88 1.36-.41.41-.81.67-1.36.88-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.7 3.7 0 0 1-1.36-.88 3.7 3.7 0 0 1-.88-1.36c-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.21-.55.47-.95.88-1.36.41-.41.81-.67 1.36-.88.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17C2.4 9.9 2.4 10.26 2.4 12s.01 2.1.07 3.34c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.6.07 4.73.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.6.07-3.34s-.01-2.1-.07-3.34c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4C15.5 4.01 15.14 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8.08a3.18 3.18 0 1 0 0-6.36 3.18 3.18 0 0 0 0 6.36Zm6.24-8.28a1.14 1.14 0 1 1-2.29 0 1.14 1.14 0 0 1 2.29 0Z" />
    </svg>
  );
}

export function IconYouTube() {
  return (
    <svg {...brand}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8ZM10 15.25v-6.5L15.6 12 10 15.25Z" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  linkedin: IconLinkedIn,
  x: IconX,
  instagram: IconInstagram,
  youtube: IconYouTube,
};
