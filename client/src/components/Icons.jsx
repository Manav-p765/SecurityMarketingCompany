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

export function IconMegaphone() {
  return (
    <svg {...base}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="m7 15 1.5 5h2L9.5 15.8" />
      <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

export function IconSocial() {
  return (
    <svg {...base}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8" />
    </svg>
  );
}

export function IconMail() {
  return (
    <svg {...base}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

export function IconMapPin() {
  return (
    <svg {...base}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <path d="m9.5 10 1.75 1.75L14.75 8.5" />
    </svg>
  );
}

export function IconFlow() {
  return (
    <svg {...base}>
      <rect x="3" y="4" width="6" height="5" rx="1" />
      <rect x="15" y="4" width="6" height="5" rx="1" />
      <rect x="9" y="15" width="6" height="5" rx="1" />
      <path d="M6 9v2.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9M12 12.5V15" />
    </svg>
  );
}

/** Keyed by the `icon` field on each entry in `services` (content.js). */
export const SERVICE_ICONS = {
  browser: IconBrowser,
  search: IconSearch,
  megaphone: IconMegaphone,
  social: IconSocial,
  mail: IconMail,
  'map-pin': IconMapPin,
  flow: IconFlow,
};

/* --- Industry icon -------------------------------------------------------- */

export function IconShieldCheck() {
  return (
    <svg {...base}>
      <path d="M12 3.5 5 6.2v5.4c0 4 2.9 7.5 7 8.9 4.1-1.4 7-4.9 7-8.9V6.2L12 3.5Z" />
      <path d="m9 12 2.25 2.25L15.5 10" />
    </svg>
  );
}

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

export function IconFacebook() {
  return (
    <svg {...brand}>
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63A20.9 20.9 0 0 0 14.25 4.5c-2.25 0-3.8 1.37-3.8 3.9v2.16H7.9v2.94h2.55V21h3.05Z" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  linkedin: IconLinkedIn,
  facebook: IconFacebook,
  x: IconX,
  instagram: IconInstagram,
  youtube: IconYouTube,
};
