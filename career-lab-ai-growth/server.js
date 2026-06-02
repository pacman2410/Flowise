import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const dataDir = join(root, "data");
const betaLeadPath = join(dataDir, "beta-leads.json");
const checkinPath = join(dataDir, "checkins.json");
const port = Number(process.env.PORT || 4177);
const host = process.env.HOST || "0.0.0.0";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const betaOffers = [
  {
    id: "promotion",
    name: "Promotion Readiness",
    price: "$99",
    premiumPrice: "$299 with human review",
    promise: "Find out if your promotion case is visible, credible, and backed by proof your manager can use.",
    includes: [
      "Career Health and Promotion Readiness scores",
      "A 90-day promotion case plan",
      "Evidence checklist for measurable wins",
      "Weekly visibility actions",
      "Manager conversation prep",
    ],
  },
  {
    id: "new_manager",
    name: "New Manager Readiness",
    price: "$99",
    premiumPrice: "$299 with human review",
    promise: "See whether you are ready to lead people, not just carry more work, and build the habits managers need.",
    includes: [
      "Career Health and New Manager Readiness scores",
      "A first-90-days manager plan",
      "Delegation and communication actions",
      "Leadership signal tracking",
      "Difficult conversation prep",
    ],
  },
];

const weights = {
  careerHealth: {
    clarity: 0.2,
    alignment: 0.15,
    readiness: 0.2,
    skill: 0.15,
    relationships: 0.15,
    consistency: 0.15,
  },
  promotion: {
    results: 0.25,
    visibility: 0.2,
    relationships: 0.15,
    leadership: 0.15,
    strategy: 0.15,
    influence: 0.1,
  },
  newManager: {
    roleTransition: 0.15,
    delegation: 0.15,
    difficultConversations: 0.15,
    teamManagement: 0.2,
    communication: 0.15,
    prioritization: 0.2,
  },
};

async function ensureData() {
  await mkdir(dataDir, { recursive: true });
  if (!existsSync(betaLeadPath)) {
    await writeFile(betaLeadPath, JSON.stringify([], null, 2));
  }
  if (!existsSync(checkinPath)) {
    await writeFile(checkinPath, JSON.stringify([], null, 2));
  }
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function readJson(path) {
  await ensureData();
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await writeFile(path, JSON.stringify(value, null, 2));
}

function send(res, status, body, headers = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    ...headers,
  });
  res.end(payload);
}

function numeric(body, key, fallback = 3) {
  const value = Number(body[key]);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(5, value));
}

function normalizeScore(value) {
  return Math.round(((value - 1) / 4) * 100);
}

function weightedScore(componentScores, componentWeights) {
  return Math.round(
    Object.entries(componentWeights).reduce((total, [key, weight]) => total + (componentScores[key] || 0) * weight, 0)
  );
}

function band(score, type) {
  const bands = {
    careerHealth: [
      [39, "At Risk"],
      [59, "Unclear"],
      [74, "Stable"],
      [89, "Building Momentum"],
      [100, "High Momentum"],
    ],
    promotion: [
      [49, "Not Ready To Ask"],
      [69, "Build Evidence First"],
      [84, "Prepare Promotion Case"],
      [100, "Ready For Conversation"],
    ],
    newManager: [
      [39, "Needs Foundation"],
      [59, "Emerging But Inconsistent"],
      [74, "Ready With Support"],
      [89, "Strong New Manager Candidate"],
      [100, "High Readiness"],
    ],
  };
  return bands[type].find(([max]) => score <= max)?.[1] || "Needs Review";
}

function lowestComponents(scores, labels, limit = 3) {
  return Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, limit)
    .map(([key, score]) => ({ key, label: labels[key], score }));
}

function highestComponents(scores, labels, limit = 3) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, score]) => ({ key, label: labels[key], score }));
}

function actionsFor(blockers, track) {
  const actionMap = {
    clarity: "Pick one career outcome for the next 90 days and define what would make it a win.",
    alignment: "Decide whether your current work is building the proof your next role requires.",
    readiness: "Write five proof points that would make your next move feel credible.",
    skill: "Choose one skill gap and practice it in a real work situation this week.",
    relationships: "Name three people who influence your next move and create one useful touchpoint.",
    consistency: "Shrink the plan to one career action you can finish before the next check-in.",
    results: "Build a promotion evidence list with measurable outcomes from the last 6-12 months.",
    visibility: "Send one impact update that connects your work to a business priority.",
    leadership: "Capture one example where you improved outcomes for other people, not just yourself.",
    strategy: "Rewrite one project update with tradeoffs, business context, and a recommended next step.",
    influence: "Tailor one recommendation for the stakeholder who needs to support it.",
    roleTransition: "Write down what you must stop owning personally if you become the manager.",
    delegation: "Delegate one task with a clear outcome, owner, deadline, and check-in point.",
    difficultConversations: "Draft one feedback conversation using behavior, impact, and expectation.",
    teamManagement: "Create a first 1:1 template covering priorities, blockers, development, and follow-up.",
    communication: "Clarify owners and next steps for one active team discussion.",
    prioritization: "Separate this week's work into urgent, important, and optional.",
  };
  const defaults =
    track === "new_manager"
      ? ["Build your first-90-days manager plan.", "Create a delegation map.", "Practice one difficult conversation script."]
      : ["Build your promotion evidence vault.", "Ask your manager what evidence matters.", "Send one visibility update."];
  const mapped = blockers.map((blocker) => actionMap[blocker.key]).filter(Boolean);
  return [...mapped, ...defaults].slice(0, 3);
}

function createAssessmentReport(body) {
  const track = body.track === "new_manager" ? "new_manager" : "promotion";
  const careerScores = {
    clarity: normalizeScore(numeric(body, "clarity")),
    alignment: normalizeScore(numeric(body, "alignment")),
    readiness: normalizeScore(numeric(body, "readiness")),
    skill: normalizeScore(numeric(body, "skill")),
    relationships: normalizeScore(numeric(body, "relationships")),
    consistency: normalizeScore(numeric(body, "consistency")),
  };
  const careerHealthScore = weightedScore(careerScores, weights.careerHealth);

  const labels = {
    clarity: "Career Clarity",
    alignment: "Role Alignment",
    readiness: "Readiness For Next Move",
    skill: "Skill Development",
    relationships: "Relationships And Influence",
    consistency: "Action Consistency",
    results: "Results",
    visibility: "Visibility",
    leadership: "Leadership Signals",
    strategy: "Strategic Thinking",
    influence: "Influence",
    roleTransition: "Role Transition",
    delegation: "Delegation",
    difficultConversations: "Difficult Conversations",
    teamManagement: "Team Management",
    communication: "Communication",
    prioritization: "Prioritization",
  };

  const readinessScores =
    track === "new_manager"
      ? {
          roleTransition: normalizeScore(numeric(body, "roleTransition")),
          delegation: normalizeScore(numeric(body, "delegation")),
          difficultConversations: normalizeScore(numeric(body, "difficultConversations")),
          teamManagement: normalizeScore(numeric(body, "teamManagement")),
          communication: normalizeScore(numeric(body, "communication")),
          prioritization: normalizeScore(numeric(body, "prioritization")),
        }
      : {
          results: normalizeScore(numeric(body, "results")),
          visibility: normalizeScore(numeric(body, "visibility")),
          relationships: normalizeScore(numeric(body, "relationships")),
          leadership: normalizeScore(numeric(body, "leadership")),
          strategy: normalizeScore(numeric(body, "strategy")),
          influence: normalizeScore(numeric(body, "influence")),
        };

  const readinessScore = weightedScore(readinessScores, track === "new_manager" ? weights.newManager : weights.promotion);
  const blockers = lowestComponents({ ...careerScores, ...readinessScores }, labels);
  const strengths = highestComponents({ ...careerScores, ...readinessScores }, labels);
  const focusAreas = lowestComponents(readinessScores, labels, 3);
  const nextActions = actionsFor(blockers, track);
  const offer = betaOffers.find((item) => item.id === track);
  const target = body.target || (track === "new_manager" ? "become a stronger new manager" : "prepare for promotion");

  return {
    id: `report_${Date.now()}`,
    track,
    offerName: offer.name,
    name: body.name || "Beta user",
    email: body.email || "",
    target,
    careerHealth: {
      score: careerHealthScore,
      band: band(careerHealthScore, "careerHealth"),
      components: careerScores,
    },
    readiness: {
      score: readinessScore,
      band: band(readinessScore, track === "new_manager" ? "newManager" : "promotion"),
      components: readinessScores,
    },
    strengths,
    blockers,
    focusAreas,
    nextActions,
    blueprint: {
      outcome: `Make visible progress toward: ${target}.`,
      day30: track === "new_manager" ? "Build your manager rhythm and delegation map." : "Finish your evidence inventory and confirm what your manager needs to see.",
      day60: track === "new_manager" ? "Practice feedback, difficult conversations, and team prioritization." : "Increase visibility with stakeholders and package your impact.",
      day90: track === "new_manager" ? "Show reliable leadership habits through team outcomes." : "Prepare the promotion conversation with proof, timing, and follow-up.",
      successMetric: "Complete one career action each week and improve the lowest readiness score.",
    },
    escalation:
      readinessScore >= 70
        ? "Human review recommended before the promotion or role-change conversation."
        : "Human review recommended if the same blocker repeats for two check-ins.",
  };
}

function createCheckinResponse(body) {
  const completed = Number(body.completed || 0);
  const confidence = Number(body.confidence || 3);
  const blocker = String(body.blocker || "").trim();
  const momentum = Math.max(0, Math.min(100, Math.round(completed * 20 + confidence * 12 - (blocker ? 12 : 0))));
  let recommendation = "Finish one specific career action before adding more tasks.";
  if (completed >= 3 && confidence >= 4) recommendation = "You have momentum. Add one visibility or stakeholder action next week.";
  if (completed <= 1 && blocker) recommendation = "The plan is too heavy. Pick the smallest action that removes the current blocker.";
  return {
    id: `checkin_${Date.now()}`,
    momentum,
    recommendation,
    nextAction: body.nextAction || "Choose one action that improves your lowest readiness score.",
    escalation: blocker && confidence <= 2 ? "Human review recommended because confidence is low and the blocker is still active." : "No human review needed yet.",
  };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/offers") {
    return send(res, 200, { offers: betaOffers });
  }

  if (req.method === "POST" && url.pathname === "/api/assessment") {
    const body = await readJsonBody(req);
    const report = createAssessmentReport(body);
    const leads = await readJson(betaLeadPath);
    leads.unshift({ ...report, createdAt: new Date().toISOString() });
    await writeJson(betaLeadPath, leads);
    return send(res, 201, { report });
  }

  if (req.method === "GET" && url.pathname === "/api/beta-leads") {
    return send(res, 200, await readJson(betaLeadPath));
  }

  if (req.method === "POST" && url.pathname === "/api/checkin") {
    const body = await readJsonBody(req);
    const checkin = createCheckinResponse(body);
    const checkins = await readJson(checkinPath);
    checkins.unshift({ ...checkin, createdAt: new Date().toISOString() });
    await writeJson(checkinPath, checkins);
    return send(res, 201, { checkin });
  }

  return send(res, 404, { error: "Not found" });
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);
  if (!filePath.startsWith(publicDir)) return send(res, 403, "Forbidden");

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": mime[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    const fallback = await readFile(join(publicDir, "index.html"));
    res.writeHead(200, { "content-type": mime[".html"] });
    res.end(fallback);
  }
}

await ensureData();

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
    } else {
      await serveStatic(req, res, url);
    }
  } catch (error) {
    send(res, 500, { error: error instanceof Error ? error.message : "Unknown error" });
  }
}).listen(port, host, () => {
  console.log(`Career Lab HQ running at http://localhost:${port}`);
});
