# NEWST — website V1

Approved pre-launch website, 24 October 2026.

Premium menswear born in Birmingham. Not Born Into It. Built For It.

## Included

- Homepage, Collection 001 and expanded Standard section.
- Five product concepts with selectable colour imagery and expanded details.
- Our City editorial page.
- Existing Klaviyo early-access signup embed.

## Local preview

This is a buildless HTML, CSS and JavaScript website. No package installation is required.

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Use an HTTP server rather than opening the files directly, because navigation includes root-relative links.

## Hosting

The website is hosted separately through Sites. This GitHub repository preserves the approved source and assets; a push here does not automatically deploy the website. The hosting configuration is managed in the Sites checkout and is not included in this public repository.

## V1 baseline

See V1.md for the approved baseline and SHA256SUMS.txt for exact file checksums. Preserve this baseline and use branches for subsequent work.

## Launch status

Products and imagery are development concepts. Public launch, custom domain, final production specifications, commerce and fulfilment are later-stage work. Signup rendering and validation have been checked; real confirmation-email and welcome-flow delivery still require an end-to-end test.

## Public repository scope

Only website files and supporting project documentation are included. Private API keys, internal brand/planning documents, supplier briefs, original museum photos and financial models are excluded. The Klaviyo company identifier in signup.js is a public embed identifier.
