# Golf Analytics Lab — Build a Better Bag Golf Ball Buyers Guide

## Meijer-updated GitHub package

This package rebuilds the app using the uploaded expanded database:

- Source workbook: `golf_ball_database_meijer_updated.xlsx`
- Records: 116
- Brands: 29
- Recommendation-eligible records: 110
- Live app data: `data.js`
- Fixed app shell: `app.js`

## Important fix

The uploaded `app(1).js` is included only as `app_uploaded_reference_mobile_incomplete.js`.
It is not used as the live app file because it does not contain the fixed mobile Find Your Fit / Hide Fit panel behavior.

Use this package as a full upload to GitHub Pages rather than replacing only one JavaScript file.

## Features preserved

- Working mobile Find Your Fit button
- Non-floating Hide Fit button inside the mobile filter panel
- Mens / Ladies selector
- Ladies pink styling
- Retailer Mode / Store Mode
- Walmart, Dick’s, PGA Superstore, Amazon, Meijer, Sam’s Club, Costco, Brand Direct
- Factory Question compatibility
- Meijer private-label record support

## GitHub upload

Upload the contents of this ZIP to the repository root. Do not upload the ZIP file itself.
Keep `data.js` loaded before `app.js`.
