# Really Social website

Plain HTML and CSS. No build step: Netlify publishes the files as they are.

## Pages
- `index.html` (homepage)
- `pricing.html`
- `enterprise.html`
- `privacy.html` and `terms.html` (paste your policies in)

## Swapping photos
Every photo lives in `images/`. To replace one, upload your photo with the **same file name** (e.g. `hero.jpg`) and it appears everywhere it's used. Each placeholder shows its file name and ideal size. Also update the `alt="[Describe photo]"` text in the HTML so screen readers and Google know what's in it.

## Settings
Open `script.js` and set:
- `QUIZ_URL`: the link every "Take the quiz" button uses
- `CONTACT_EMAIL`: where the Enterprise "Talk to us" buttons send emails

## Before moving to reallysocial.media
This site is set up as a hidden staging site. When it goes live on the main domain:
1. Remove the `<meta name="robots" content="noindex, nofollow">` line from every page.
2. Replace `robots.txt` with one that allows search engines.
