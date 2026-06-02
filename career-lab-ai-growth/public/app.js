const offerGrid = document.querySelector("#offerGrid");
const assessmentForm = document.querySelector("#assessmentForm");
const assessmentResult = document.querySelector("#assessmentResult");
const checkinForm = document.querySelector("#checkinForm");
const checkinResult = document.querySelector("#checkinResult");
const trackSelect = document.querySelector("#trackSelect");

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function fillScaleSelects() {
  document.querySelectorAll("select:not(#trackSelect)").forEach((select) => {
    select.innerHTML = `
      <option value="1">1 - Not true</option>
      <option value="2">2 - Slightly true</option>
      <option value="3" selected>3 - Somewhat true</option>
      <option value="4">4 - Mostly true</option>
      <option value="5">5 - Strongly true</option>
    `;
  });
}

function setTrackFields() {
  const selected = trackSelect.value;
  document.querySelectorAll(".track-fields").forEach((field) => {
    field.classList.toggle("hidden", field.dataset.track !== selected);
  });
}

function renderOffers(offers) {
  offerGrid.innerHTML = offers
    .map(
      (offer) => `
        <article class="offer-card">
          <div class="panel-label">Career track</div>
          <h3>${escapeHtml(offer.name)}</h3>
          <p>${escapeHtml(offer.promise)}</p>
          <div class="price">${escapeHtml(offer.price)}</div>
          <div class="premium-price">${escapeHtml(offer.premiumPrice)}</div>
          <ul>
            ${offer.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
          <a class="button secondary" href="#assessment">Start ${escapeHtml(offer.name)}</a>
        </article>
      `
    )
    .join("");
}

function componentList(components) {
  return Object.entries(components)
    .map(([key, value]) => `<li><span>${escapeHtml(key.replaceAll(/([A-Z])/g, " $1"))}</span><strong>${value}</strong></li>`)
    .join("");
}

function pillList(items) {
  return items.map((item) => `<li><span>${escapeHtml(item.label)}</span><strong>${item.score}</strong></li>`).join("");
}

function renderAssessment(report) {
  assessmentResult.innerHTML = `
    <div class="report-header">
      <div>
        <p class="eyebrow">Your scorecard</p>
        <h3>${escapeHtml(report.offerName)}</h3>
        <p class="muted">${escapeHtml(report.target)}</p>
      </div>
    </div>
    <div class="score-row report-scores">
      <div><strong>${report.careerHealth.score}</strong><span>${escapeHtml(report.careerHealth.band)}</span><small>Career Health</small></div>
      <div><strong>${report.readiness.score}</strong><span>${escapeHtml(report.readiness.band)}</span><small>Readiness</small></div>
    </div>

    <h3>Strengths</h3>
    <ul class="metric-list">${pillList(report.strengths)}</ul>

    <h3>Risks</h3>
    <ul class="metric-list">${pillList(report.blockers)}</ul>

    <h3>Focus Areas</h3>
    <ul class="metric-list">${pillList(report.focusAreas)}</ul>

    <h3>Recommended Next Actions</h3>
    <ol class="action-list">${report.nextActions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>

    <h3>90-day plan</h3>
    <div class="blueprint">
      <p><strong>30 days:</strong> ${escapeHtml(report.blueprint.day30)}</p>
      <p><strong>60 days:</strong> ${escapeHtml(report.blueprint.day60)}</p>
      <p><strong>90 days:</strong> ${escapeHtml(report.blueprint.day90)}</p>
      <p><strong>Success metric:</strong> ${escapeHtml(report.blueprint.successMetric)}</p>
    </div>

    <div class="escalation"><strong>Human escalation:</strong> ${escapeHtml(report.escalation)}</div>
  `;
}

function renderCheckin(checkin) {
  checkinResult.innerHTML = `
    <p class="eyebrow">Momentum update</p>
    <div class="score">${checkin.momentum}</div>
    <h3>Recommended next move</h3>
    <p>${escapeHtml(checkin.recommendation)}</p>
    <div class="blueprint">
      <p><strong>Next action:</strong> ${escapeHtml(checkin.nextAction)}</p>
      <p><strong>Escalation:</strong> ${escapeHtml(checkin.escalation)}</p>
    </div>
  `;
}

assessmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = assessmentForm.querySelector("button");
  button.disabled = true;
  try {
    const { report } = await api("/api/assessment", {
      method: "POST",
      body: JSON.stringify(formData(assessmentForm)),
    });
    renderAssessment(report);
  } catch (error) {
    assessmentResult.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  } finally {
    button.disabled = false;
  }
});

checkinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = checkinForm.querySelector("button");
  button.disabled = true;
  try {
    const { checkin } = await api("/api/checkin", {
      method: "POST",
      body: JSON.stringify(formData(checkinForm)),
    });
    renderCheckin(checkin);
  } catch (error) {
    checkinResult.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  } finally {
    button.disabled = false;
  }
});

trackSelect.addEventListener("change", setTrackFields);

async function boot() {
  fillScaleSelects();
  setTrackFields();
  const { offers } = await api("/api/offers");
  renderOffers(offers);
}

boot().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="error">${escapeHtml(error.message)}</div>`);
});
