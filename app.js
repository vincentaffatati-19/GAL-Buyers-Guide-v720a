/*
 * Golf Analytics Lab — Build a Better Bag Golf Ball Buyers Guide
 * Men/Women audience update.
 *
 * This file works with the existing index.html. It inserts the audience
 * selector automatically, so no HTML edit is required.
 */
(function () {
  "use strict";

  const balls = Array.isArray(window.GOLF_BALLS)
    ? window.GOLF_BALLS
    : Array.isArray(window.GOLF_BALL_DATA)
      ? window.GOLF_BALL_DATA
      : [];

  const meta = window.GOLF_BALL_META || {};
  const state = {
    audience: "men",
    retailer: "all",
    swing: "not-sure",
    feel: "no-preference",
    cover: "balanced",
    budget: "no-preference",
    construction: "no-preference",
    brand: "all",
    search: "",
    sort: "score",
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function finiteNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
  }

  function includesAny(text, terms) {
    const haystack = normalize(text);
    return terms.some((term) => haystack.includes(term));
  }


  const RETAILERS = {
    all: { shortLabel: "All Retailers" },
    walmart: { shortLabel: "Walmart" },
    dicks: { shortLabel: "Dick’s" },
    pga: { shortLabel: "PGA Superstore" },
    amazon: { shortLabel: "Amazon" },
    brand: { shortLabel: "Brand Direct" },
  };

  function retailerLabel(value = state.retailer) {
    return RETAILERS[value]?.shortLabel || "All Retailers";
  }

  function retailerAvailable(ball, retailer = state.retailer) {
    if (retailer === "all") return true;
    if (retailer === "walmart") return Boolean(ball.availableWalmart);
    if (retailer === "dicks") return Boolean(ball.availableDicks);
    if (retailer === "pga") return Boolean(ball.availablePgaSuperstore);
    if (retailer === "amazon") return Boolean(ball.availableAmazon);
    if (retailer === "brand") return Boolean(ball.availableBrandDirect);
    return true;
  }

  function retailerNote(ball, retailer = state.retailer) {
    if (retailer === "all") return "Availability varies by store and online channel.";
    if (retailer === "walmart") return ball.walmartAvailabilityNote || "Walmart availability not confirmed in the current database.";
    if (retailer === "dicks") return ball.dicksAvailabilityNote || "Dick’s availability not confirmed in the current database.";
    if (retailer === "pga") return ball.pgaAvailabilityNote || "PGA Superstore availability not confirmed in the current database.";
    if (retailer === "amazon") return ball.amazonAvailabilityNote || "Amazon availability not confirmed in the current database.";
    if (retailer === "brand") return ball.brandAvailabilityNote || "Brand-direct availability not confirmed in the current database.";
    return "Availability varies by retailer.";
  }

  function retailerLink(ball, retailer = state.retailer) {
    if (retailer === "walmart") return ball.walmartUrl || "";
    if (retailer === "dicks") return ball.dicksUrl || "";
    if (retailer === "pga") return ball.pgaSuperstoreUrl || "";
    if (retailer === "amazon") return ball.amazonAffiliateUrl || ball.amazonSearchUrl || "";
    if (retailer === "brand") return ball.brandSiteUrl || ball.sourceUrl || "";
    return ball.sourceUrl || ball.brandSiteUrl || ball.amazonSearchUrl || "";
  }

  function retailerButtonText(retailer = state.retailer) {
    if (retailer === "all") return "Product source ↗";
    if (retailer === "amazon") return "Check Amazon ↗";
    if (retailer === "brand") return "Brand site ↗";
    return `Check ${retailerLabel(retailer)} ↗`;
  }


  function addAudienceSelector() {
    const controls = $(".controls");
    const firstExistingGroup = controls?.querySelector(".control-group");
    if (!controls || !firstExistingGroup || $('[data-generated="audience-control"]')) return;

    const wrapper = document.createElement("div");
    wrapper.className = "control-group";
    wrapper.dataset.generated = "audience-control";
    wrapper.innerHTML = `
      <label>Golfer</label>
      <div class="segmented gender-segmented">
        <button class="active" data-field="audience" data-value="men">Mens</button>
        <button data-field="audience" data-value="women">Ladies</button>
      </div>
    `;
    controls.insertBefore(wrapper, firstExistingGroup);
  }


  function addRetailerSelector() {
    const controls = $(".controls");
    const audienceGroup = $('[data-generated="audience-control"]');
    if (!controls || $('[data-generated="retailer-control"]')) return;

    const wrapper = document.createElement("div");
    wrapper.className = "control-group retailer-control";
    wrapper.dataset.generated = "retailer-control";
    wrapper.innerHTML = `
      <label>Where are you shopping?</label>
      <div class="help">Use Store Mode in the aisle or when shopping a specific retailer. Local inventory may vary.</div>
      <div class="segmented retailer-segmented">
        <button class="active" data-field="retailer" data-value="all">All</button>
        <button data-field="retailer" data-value="walmart">Walmart</button>
        <button data-field="retailer" data-value="dicks">Dick’s</button>
        <button data-field="retailer" data-value="pga">PGA Superstore</button>
        <button data-field="retailer" data-value="amazon">Amazon</button>
        <button data-field="retailer" data-value="brand">Brand Direct</button>
      </div>
    `;

    if (audienceGroup?.nextSibling) controls.insertBefore(wrapper, audienceGroup.nextSibling);
    else if (audienceGroup) controls.appendChild(wrapper);
    else controls.insertBefore(wrapper, controls.firstChild);
  }

  function addSupportingStyles() {
    if ($("#gal-gender-js-styles")) return;
    const style = document.createElement("style");
    style.id = "gal-gender-js-styles";
    style.textContent = `
      .ball-card {
        border: 1px solid rgba(12, 31, 51, .14);
        border-radius: 16px;
        padding: 18px;
        background: #fff;
        box-shadow: 0 8px 24px rgba(12, 31, 51, .07);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ball-card__top, .ball-card__footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .ball-card h3 { margin: 0; font-size: 1.08rem; line-height: 1.25; }
      .ball-card__brand {
        color: #f28c28;
        font-weight: 800;
        font-size: .78rem;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      .match-score {
        min-width: 54px;
        border-radius: 999px;
        padding: 7px 9px;
        text-align: center;
        background: #0b1f33;
        color: #fff;
        font-weight: 800;
        font-size: .82rem;
      }
      .audience-badge {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        border-radius: 999px;
        padding: 5px 9px;
        background: #e8f1f8;
        color: #0b1f33;
        font-size: .72rem;
        font-weight: 800;
      }
      .audience-badge--women { background: #f6c28b; }
      .ball-specs {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .ball-spec {
        border-radius: 10px;
        background: #f5f7f9;
        padding: 9px 10px;
        font-size: .78rem;
        line-height: 1.3;
      }
      .ball-spec b { display: block; color: #0b1f33; margin-bottom: 2px; }
      .match-reasons { margin: 0; padding-left: 18px; font-size: .82rem; line-height: 1.45; }
      .ball-card__notes { margin: 0; font-size: .82rem; line-height: 1.45; color: #46515c; }
      .ball-card__link {
        color: #0b1f33;
        font-weight: 800;
        text-decoration: none;
      }
      .ball-card__link:hover { text-decoration: underline; }
      .availability-warning { color: #9a3412; font-weight: 800; font-size: .75rem; }
      .factory-question {
        border: 1px solid rgba(12, 31, 51, .12);
        border-left: 5px solid #f28c28;
        border-radius: 14px;
        background: #f8fbff;
        padding: 12px;
        font-size: .78rem;
        line-height: 1.4;
      }
      .factory-title {
        color: #0b1f33;
        font-weight: 900;
        margin-bottom: 6px;
      }
      .factory-line {
        color: #46515c;
        margin-top: 4px;
      }
      .factory-line b {
        color: #0b1f33;
      }
      .no-results {
        grid-column: 1 / -1;
        padding: 36px 20px;
        text-align: center;
        border: 1px dashed rgba(12,31,51,.25);
        border-radius: 14px;
      }
      @media (max-width: 520px) {
        .ball-specs { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }


  function addMobilePanelCloseButton() {
    const controls = $(".controls");
    if (!controls || $("#mobilePanelClose")) return;

    const closeButton = document.createElement("button");
    closeButton.id = "mobilePanelClose";
    closeButton.type = "button";
    closeButton.className = "mobile-panel-close";
    closeButton.textContent = "Hide Fit";
    controls.insertBefore(closeButton, controls.firstChild);
  }

  function populateBrands() {
    const select = $("#brand");
    if (!select) return;

    const brands = [...new Set(balls.map((ball) => ball.brand).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));

    select.innerHTML = '<option value="all">All brands</option>' +
      brands.map((brand) => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`).join("");
  }

  function isAudienceEligible(ball) {
    return state.audience === "women" ? Boolean(ball.eligibleWomen) : Boolean(ball.eligibleMen);
  }

  function compressionScore(ball, reasons) {
    const compression = finiteNumber(ball.compression);
    if (compression === null || state.swing === "not-sure") return 0;

    const targets = {
      slow: { ideal: 50, tolerance: 28 },
      moderate: { ideal: 72, tolerance: 25 },
      fast: { ideal: 92, tolerance: 24 },
    };
    const target = targets[state.swing];
    const distance = Math.abs(compression - target.ideal);
    const score = Math.max(-20, 28 - (distance / target.tolerance) * 30);

    if (score >= 16) reasons.push(`Compression ${compression} is a strong ${state.swing} swing-speed match.`);
    else if (score >= 7) reasons.push(`Compression ${compression} is within a practical ${state.swing} range.`);
    return score;
  }

  function feelScore(ball, reasons) {
    if (state.feel === "no-preference") return 0;
    const compression = finiteNumber(ball.compression);
    const text = `${ball.compressionRaw} ${ball.notes} ${ball.construction}`;

    let perceived = "balanced";
    if ((compression !== null && compression <= 62) || includesAny(text, ["very soft", "soft feel", "low compression"])) {
      perceived = "soft";
    } else if ((compression !== null && compression >= 86) || includesAny(text, ["firm", "high compression"])) {
      perceived = "firm";
    }

    if (perceived === state.feel) {
      reasons.push(`${state.feel[0].toUpperCase() + state.feel.slice(1)} feel matches your preference.`);
      return 14;
    }
    if (perceived === "balanced" || state.feel === "balanced") return 5;
    return -7;
  }

  function coverScore(ball, reasons) {
    const cover = normalize(ball.cover);
    const urethane = cover.includes("urethane");
    const durable = includesAny(cover, ["ionomer", "surlyn", "truflex", "hybrid"]);

    if (state.cover === "spin") {
      if (urethane) {
        reasons.push("Urethane cover supports more greenside spin and control.");
        return 18;
      }
      return -7;
    }

    if (state.cover === "durable") {
      if (durable && !urethane) {
        reasons.push("Durable cover aligns with value and long-wearing performance.");
        return 16;
      }
      return urethane ? -5 : 5;
    }

    // Balanced
    if (urethane) return 9;
    if (durable) return 8;
    return 3;
  }

  function budgetScore(ball, reasons) {
    const price = finiteNumber(ball.parsedPrice);
    if (state.budget === "no-preference" || price === null) return 0;

    let match = false;
    if (state.budget === "value") match = price < 30;
    if (state.budget === "mid") match = price >= 30 && price < 45;
    if (state.budget === "premium") match = price >= 45;

    if (match) {
      reasons.push(`Price fits the ${state.budget} budget tier.`);
      return 16;
    }

    if (state.budget === "value" && price >= 45) return -15;
    if (state.budget === "premium" && price < 30) return -4;
    return -8;
  }

  function constructionScore(ball, reasons) {
    if (state.construction === "no-preference") return 0;
    const construction = normalize(ball.construction);
    let match = false;

    if (state.construction === "2-piece") match = construction.includes("2-piece");
    if (state.construction === "3-piece") match = construction.includes("3-piece");
    if (state.construction === "4-plus") {
      match = includesAny(construction, ["4-piece", "5-piece", "multi-piece", "dual-core", "tour construction"]);
    }

    if (match) {
      reasons.push(`${ball.construction} construction matches your selection.`);
      return 12;
    }
    return -12;
  }

  function audienceScore(ball, reasons) {
    if (state.audience === "women" && ball.productAudience === "Women-specific") {
      const fitText = normalize(ball.suggestedSwingSpeedFit);
      const swingAligned =
        state.swing === "not-sure" ||
        fitText.includes(state.swing) ||
        (state.swing === "slow" && fitText.includes("moderate"));

      if (swingAligned) {
        reasons.push("Women-specific design is included without excluding unisex performance matches.");
        return 5;
      }
    }
    return 0;
  }

  function qualityScore(ball) {
    const confidence = normalize(ball.dataConfidence);
    if (confidence === "high") return 3;
    if (confidence === "medium") return 1;
    return 0;
  }

  function availabilityScore(ball, reasons) {
    const status = normalize(ball.linkStatus);
    if (includesAny(status, ["sold out", "unavailable"])) {
      reasons.push("Availability may be limited.");
      return -12;
    }
    return 0;
  }

  function scoreBall(ball) {
    const reasons = [];
    let score = 50;

    score += compressionScore(ball, reasons);
    score += feelScore(ball, reasons);
    score += coverScore(ball, reasons);
    score += budgetScore(ball, reasons);
    score += constructionScore(ball, reasons);
    score += audienceScore(ball, reasons);
    score += qualityScore(ball);
    score += availabilityScore(ball, reasons);

    score = Math.max(0, Math.min(100, Math.round(score)));
    return { ...ball, score, reasons: reasons.slice(0, 4) };
  }

  function matchesFilters(ball) {
    if (!isAudienceEligible(ball)) return false;
    if (!retailerAvailable(ball)) return false;
    if (state.brand !== "all" && ball.brand !== state.brand) return false;

    if (state.search) {
      const haystack = normalize([
        ball.brand,
        ball.model,
        ball.compressionRaw,
        ball.construction,
        ball.cover,
        ball.cost,
        ball.retailers,
        ball.notes,
        ball.womensFitCategory,
        ball.suggestedSwingSpeedFit,
        ball.launchProfile,
        ball.womensFitRationale,
        ball.productAudience,
      ].join(" "));

      if (!haystack.includes(normalize(state.search))) return false;
    }

    return true;
  }

  function sortResults(results) {
    const copy = [...results];

    const numberOr = (value, fallback) => {
      const number = finiteNumber(value);
      return number === null ? fallback : number;
    };

    const sorters = {
      score: (a, b) => b.score - a.score || a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model),
      "cost-low": (a, b) => numberOr(a.parsedPrice, Infinity) - numberOr(b.parsedPrice, Infinity),
      "cost-high": (a, b) => numberOr(b.parsedPrice, -Infinity) - numberOr(a.parsedPrice, -Infinity),
      "compression-low": (a, b) => numberOr(a.compression, Infinity) - numberOr(b.compression, Infinity),
      "compression-high": (a, b) => numberOr(b.compression, -Infinity) - numberOr(a.compression, -Infinity),
      brand: (a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model),
    };

    return copy.sort(sorters[state.sort] || sorters.score);
  }

  function displayCompression(ball) {
    return finiteNumber(ball.compression) !== null
      ? String(ball.compression)
      : (ball.compressionRaw || "Not published");
  }

  function audienceLabel(ball) {
    return ball.productAudience === "Women-specific" ? "Women-specific" : "Unisex";
  }

  function notesFor(ball) {
    if (state.audience === "women" && ball.womensFitRationale) return ball.womensFitRationale;
    return ball.notes || ball.verificationNotes || "See product source for additional specifications.";
  }

  function renderCards(results) {
    const cards = $("#cards");
    if (!cards) return;

    if (!results.length) {
      cards.innerHTML = `
        <div class="no-results">
          <h3>No exact matches found</h3>
          <p>Try All Retailers or loosen one of your fit preferences. Local store inventory changes often.</p>
        </div>
      `;
      return;
    }

    cards.innerHTML = results.slice(0, 12).map((ball) => {
      const womenClass = ball.productAudience === "Women-specific" ? " audience-badge--women" : "";
      const shoppingUrl = retailerLink(ball);
      const source = shoppingUrl
        ? `<a class="ball-card__link" href="${escapeHtml(shoppingUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(retailerButtonText())}</a>`
        : "";
      const warning = includesAny(ball.linkStatus, ["sold out", "unavailable"])
        ? `<span class="availability-warning">${escapeHtml(ball.linkStatus)}</span>`
        : "";
      const reasons = ball.reasons.length
        ? `<ul class="match-reasons">${ball.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>`
        : "";

      return `
        <article class="ball-card">
          <div class="ball-card__top">
            <div>
              <div class="ball-card__brand">${escapeHtml(ball.brand)}</div>
              <h3>${escapeHtml(ball.model)}</h3>
            </div>
            <div class="match-score">${ball.score}%</div>
          </div>

          <span class="audience-badge${womenClass}">${escapeHtml(audienceLabel(ball))}</span>

          <div class="retailer-mode-note">
            <b>${escapeHtml(retailerLabel())}:</b> ${escapeHtml(retailerNote(ball))}
            ${state.retailer !== "all" ? `<span>Ranked only from the selected shopping source.</span>` : `<span>Select a retailer to use Store Mode.</span>`}
          </div>

          <div class="ball-specs">
            <div class="ball-spec"><b>Compression</b>${escapeHtml(displayCompression(ball))}</div>
            <div class="ball-spec"><b>Construction</b>${escapeHtml(ball.construction || "Not listed")}</div>
            <div class="ball-spec"><b>Cover</b>${escapeHtml(ball.cover || "Not listed")}</div>
            <div class="ball-spec"><b>Cost</b>${escapeHtml(ball.cost || "Retailer-dependent")}</div>
          </div>

          ${reasons}
          <p class="ball-card__notes">${escapeHtml(notesFor(ball))}</p>

          <div class="factory-question">
            <div class="factory-title">The Factory Question</div>
            <div class="factory-line"><b>Made:</b> ${escapeHtml(ball.manufacturingCountry || "Not disclosed")}</div>
            <div class="factory-line"><b>Production model:</b> ${escapeHtml(ball.productionModel || "Not fully disclosed")}</div>
            <div class="factory-line"><b>Design origin:</b> ${escapeHtml(ball.designOrigin || "Not disclosed")}</div>
            <div class="factory-line"><b>Confidence:</b> ${escapeHtml(ball.productionConfidence || "Low")}</div>
          </div>

          <div class="ball-card__footer">
            ${source}
            ${warning}
          </div>
        </article>
      `;
    }).join("");
  }

  function renderComparison(results) {
    const body = $("#compareBody");
    if (!body) return;

    body.innerHTML = results.slice(0, 20).map((ball) => `
      <tr>
        <td><b>${escapeHtml(ball.brand)} ${escapeHtml(ball.model)}</b><br><small>${escapeHtml(audienceLabel(ball))}</small></td>
        <td>${ball.score}%</td>
        <td>${escapeHtml(displayCompression(ball))}</td>
        <td>${escapeHtml(ball.construction || "—")}</td>
        <td>${escapeHtml(ball.cover || "—")}</td>
        <td>${escapeHtml(ball.cost || "—")}</td>
        <td>${escapeHtml(notesFor(ball))}</td>
      </tr>
    `).join("");
  }

  function updateStats(results) {
    const eligiblePool = balls.filter(isAudienceEligible);
    const recordCount = $("#recordCount");
    const brandCount = $("#brandCount");
    const resultCount = $("#resultCount");
    const topPick = $("#topPick");
    const sourceFile = $("#sourceFile");

    if (recordCount) recordCount.textContent = String(eligiblePool.length);
    if (brandCount) brandCount.textContent = String(new Set(eligiblePool.map((ball) => ball.brand)).size);
    if (resultCount) resultCount.textContent = String(results.length);
    if (topPick) topPick.textContent = results[0] ? `${results[0].brand} ${results[0].model}` : "—";
    if (sourceFile) sourceFile.textContent = `${meta.sourceFile || "updated golf-ball database"} · Store Mode: ${retailerLabel()}`;
  }

  function render() {
    const results = sortResults(balls.filter(matchesFilters).map(scoreBall));
    renderCards(results);
    renderComparison(results);
    updateStats(results);
  }

  function setSegmentedValue(field, value, button) {
    state[field] = value;
    $$(`[data-field="${field}"]`).forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  }

  function resetControls() {
    Object.assign(state, {
      audience: "men",
      retailer: "all",
      swing: "not-sure",
      feel: "no-preference",
      cover: "balanced",
      budget: "no-preference",
      construction: "no-preference",
      brand: "all",
      search: "",
      sort: "score",
    });

    $$("[data-field]").forEach((button) => {
      const shouldBeActive =
        (button.dataset.field === "audience" && button.dataset.value === "men") ||
        (button.dataset.field === "retailer" && button.dataset.value === "all") ||
        (button.dataset.field === "swing" && button.dataset.value === "not-sure") ||
        (button.dataset.field === "feel" && button.dataset.value === "no-preference") ||
        (button.dataset.field === "cover" && button.dataset.value === "balanced") ||
        (button.dataset.field === "budget" && button.dataset.value === "no-preference");
      button.classList.toggle("active", shouldBeActive);
    });

    if ($("#construction")) $("#construction").value = "no-preference";
    if ($("#brand")) $("#brand").value = "all";
    if ($("#search")) $("#search").value = "";
    if ($("#sort")) $("#sort").value = "score";
    render();
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const segmentedButton = event.target.closest("button[data-field][data-value]");
      if (segmentedButton) {
        setSegmentedValue(
          segmentedButton.dataset.field,
          segmentedButton.dataset.value,
          segmentedButton
        );
      }
    });

    $("#construction")?.addEventListener("change", (event) => {
      state.construction = event.target.value;
      render();
    });

    $("#brand")?.addEventListener("change", (event) => {
      state.brand = event.target.value;
      render();
    });

    $("#search")?.addEventListener("input", (event) => {
      state.search = event.target.value;
      render();
    });

    $("#sort")?.addEventListener("change", (event) => {
      state.sort = event.target.value;
      render();
    });

    $("#find")?.addEventListener("click", () => {
      render();
      if (window.innerWidth <= 760) {
        document.body.classList.remove("controls-open");
        const toggle = $("#mobileFilterToggle");
        if (toggle) {
          toggle.textContent = "Find Your Fit";
          if (typeof setMobileFitButtonTheme === "function") setMobileFitButtonTheme();
        }
        $(".results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    $("#reset")?.addEventListener("click", resetControls);
    $("#mobilePanelClose")?.addEventListener("click", () => {
      document.body.classList.remove("controls-open");
      const toggle = $("#mobileFilterToggle");
      if (toggle) {
        toggle.textContent = "Find Your Fit";
        if (typeof setMobileFitButtonTheme === "function") setMobileFitButtonTheme();
      }
    });
    $("#mobileFilterToggle")?.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("controls-open");
      const toggle = $("#mobileFilterToggle");
      if (toggle) {
        toggle.textContent = isOpen ? "Find Your Fit" : "Find Your Fit";
        if (typeof setMobileFitButtonTheme === "function") setMobileFitButtonTheme();
      }
    });
  }

  function initialize() {
    if (!balls.length) {
      console.error("Golf Ball Buyers Guide: data.js did not provide any records.");
      const cards = $("#cards");
      if (cards) cards.innerHTML = '<div class="no-results"><h3>Database unavailable</h3><p>Confirm data.js loads before app.js.</p></div>';
      return;
    }

    addSupportingStyles();
    addAudienceSelector();
    addRetailerSelector();
    addMobilePanelCloseButton();
    populateBrands();
    bindEvents();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
