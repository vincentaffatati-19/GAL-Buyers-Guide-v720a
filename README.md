# Golf Ball Buyers Guide

GitHub Pages-ready static app for the Golf Analytics Lab **Build a Better Bag — Golf Ball Buyers Guide**.

## Source database

Built from the uploaded spreadsheet:

`golf_ball_brand_matrix.xlsx`

Converted records: **77 golf balls**

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this ZIP to the root of the repository.
3. Go to **Settings → Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/root`.
6. Save.
7. Open the published GitHub Pages link after deployment completes.

## Scoring model

This rebuild uses value-weighted fit scoring:

- Compression fit: 30%
- Feel: 15%
- Cover: 15%
- Construction: 10%
- Cost/value: 30%

Cost affects the score even when the golfer chooses “No preference” for budget.


## Theme update

The application background has been changed to navy blue: `#071a33`.


## Font color update

Navy-background areas now use light text, while white panels/cards/tables use dark text.


## Logo and theme update

- Header logo updated to use the uploaded company artwork: `assets/golf_analytics_lab_logo.png`
- Application navy background updated to match the logo tone: `#011734`


## Logo path update

The app now uses the logo from the repository root:

`golf_analytics_lab_logo.png`

No `assets` folder is required.


## Mobile-compatible version

This version adds:

- Phone-first responsive layout
- Sticky mobile "Show filters" button
- Larger tap targets
- Single-column results on phones
- Hidden comparison table on phones for cleaner scrolling
- Logo and navy theme retained
- Root-level logo file, so no assets folder is required


## Mobile usability update

The sticky mobile filter button now says `Find Your Fit` when closed and `Hide Fit` when open.


## Database refresh

Database refreshed: 2026-07-09

- Source workbook: `golf_ball_database_current_verified.xlsx`
- Records in app database: 77
- Added link audit and source notes
- Updated `data.js` with current source URLs, pricing where verified, and confidence notes


## Production/origin database update

This version adds production and origin information:

- Manufacturing Country
- Production Location
- Design Origin
- Company / Brand Origin
- Production Notes
- Production Confidence
- Production Source URL

Important: golf-ball country of origin is often SKU/package specific. Use the confidence field to distinguish verified brand-level production facts from rows that need package confirmation.


## Factory Question update

Each ball card now includes a buyer-guide production section:

- Made
- Production model
- Design origin
- Production confidence
- Production location
- Production notes
- Production source link

This section is intended as trust/context, not as a replacement for the 4 C's.


## Audience update

This version uses the uploaded men/women audience-aware `app.js`.

Added to the app:
- “Who are you shopping for?” selector
- Men = unisex models
- Women = women-specific + unisex models
- Women-specific badge on matching cards
- Women's fit rationale in the card notes
- Existing mobile “Find Your Fit” / “Hide Fit” behavior preserved
- Factory Question card context preserved


## Gender fit update

This testing build adds an explicit golfer choice:

- Man Golfer: leaves the existing orange Find Your Fit button and standard GAL fitting logic.
- Women Golfer: changes the mobile Find Your Fit button to pink, keeps women-specific + unisex models, and changes the fitting guidance to focus on easier launch, softer compression, carry-distance ranges, budget comfort, and short-game priority.

Women-specific fit adjustments:
- Slower / easy launch: under roughly 160 yards driver carry
- Moderate: roughly 160–200 yards carry
- Faster: 200+ yards carry
- Added extra scoring credit for lower compression, easy launch, women-specific models, and soft-feel unisex options.


## Gender fit update v2

Changes:
- Gender selector now displays only:
  - Man Golfer
  - Woman Golfer
- Removed the description labels under the gender selector.
- Woman Golfer mode now turns the fit display pink.
- Fixed the left/filter panel scrolling issue on desktop and mobile.


## Gender label update v3

Visible selection buttons now read:
- Men
- Ladies

The word “Golfer” was removed from the selection buttons.
Ladies mode keeps the pink styling and women-focused fitting logic.


## Gender label update v4

Visible selection buttons now read:
- Mens
- Ladies


## Mobile Find Your Fit button fix

This build fixes the mobile layout problem where the Find Your Fit button could float over and obstruct the filter menu.

Changes:
- Find Your Fit is no longer sticky/floating on mobile.
- The mobile filter panel opens as its own scrollable panel.
- Added a Close button inside the mobile filter panel.
- Ladies mode still turns the Find Your Fit button pink.


## Mobile bottom-locked Find Your Fit button

This build fixes the mobile app layout by locking the Find Your Fit button to the bottom of the phone screen.

Mobile behavior:
- Find Your Fit is fixed at the bottom of the screen.
- When the filter menu opens, the menu scrolls above the button.
- The button no longer overlays the menu controls.
- Tap Hide Fit to close the menu.
- Ladies mode still turns the button pink.


## Mobile Hide Fit fix

This build removes the floating Hide Fit bottom button on mobile.

Mobile behavior:
- Closed: Find Your Fit is fixed at the bottom of the phone screen.
- Open: the bottom button disappears completely.
- Open: a non-floating Hide Fit button appears inside the filter panel.
- The filter panel scrolls normally and no menu item should be blocked.


## Retailer Mode test

This build adds Store Mode / Retailer Mode to Find Your Fit.

Choices:
- All
- Walmart
- Dick’s
- PGA Superstore
- Amazon
- Brand Direct

When a retailer is selected, results are filtered to balls that the current database identifies as available or commonly checked through that retailer/source. This is not live inventory, and local store availability may vary.

Each card now includes a retailer note and the shopping/source button changes based on the selected retailer.


## Master Database v2 rebuild

This GitHub-ready package rebuilds the application using `golf_ball_master_database_v2.xlsx`.

Included features:
- Mobile-friendly Golf Analytics Lab app
- Mens / Ladies fit selector
- Ladies mode pink styling
- Mobile Find Your Fit / Hide Fit behavior
- Retailer Mode / Store Mode
- Retailer-specific buttons and availability notes
- Factory Question production/origin context
- App data generated from the Master Database v2 workbook

Database records: 77
Generated: 2026-07-24
