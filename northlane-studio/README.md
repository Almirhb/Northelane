# Northlane Studio — Website

Static, dependency-free website. No build step needed — open `index.html` directly in a browser, or open this folder in VS Code 

## Structure
```
northlane-studio/
├── index.html              Home page (hero, services, pricing, portfolio, contact, etc.)
├── terms-of-service.html   Terms of Service
├── privacy-policy.html     Privacy Policy
├── cookie-policy.html      Cookie Policy
├── css/
│   ├── style.css           Styles for index.html
│   └── legal.css           Shared styles for the three legal pages
└── js/
    └── main.js              Scroll reveal, FAQ accordion, hero background animation, contact form submit
```

## Deploying
Any static host works — drag-and-drop the whole folder into Netlify, or connect a GitHub repo to Vercel/Netlify for auto-deploys on every push.
