# Logo drop-in

Replace these files in place — the markup already points at them.

| File | Used by | Notes |
| --- | --- | --- |
| `logo-lockup-light.png` | Header, footer | Transparent, white ink + brand red. The one the dark design uses most. |
| `logo-mark-light.png` | Hero proof block, "Why us" panel | Transparent shield mark for dark backgrounds. |
| `logo-horizontal.png` | Source file | Your original dark-on-white lockup. Use it on any light surface you add. |
| `logo-mark.png` | Source for favicons | Original shield mark. The cropped favicon set in `client/public/` (`favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `icon-*.png`) was generated from it — regenerate those if you replace it. |
| `logo-badge-dark.png` | Not currently used | Circular badge. It has a baked-in black plate, so it shows as a square on the textured field. |
| `email-signature.png` | Reference only | Not used on the site. |

## About the two "-light" files

Your supplied logos are dark ink on a white background, which disappears on the
dark sections. The `-light` versions were derived from them: white ink, brand
red preserved, background made transparent. If you have proper light-on-dark
originals (ideally SVG), drop them in over these — keep the same filenames and
nothing else needs to change.

SVG is preferred if you have it. Swap the extension in
`client/src/components/Header.jsx`, `Footer.jsx`, `Hero.jsx` and `WhyUs.jsx`.
