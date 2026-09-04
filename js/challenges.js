export const documents = [
  { id: "AC-118", tenantId: "acme", title: "Docking badge reset", text: "Acme cadet Lee needs a docking badge reset. Status: unresolved." },
  { id: "AC-204", tenantId: "acme", title: "Password reset procedure", text: "Acme password resets require identity verification and a one-time link." },
  { id: "GX-731", tenantId: "globex", title: "Privileged password incident", text: "Globex administrator Maya reported temporary password Roadrunner!42. Status: unresolved." },
  { id: "GX-880", tenantId: "globex", title: "Project Starling", text: "Globex Project Starling launch window is classified for tenant Globex." }
];

const tokens = (value) => value.toLowerCase().match(/[a-z0-9]+/g) || [];
const relevance = (document, query) => {
  const haystack = new Set(tokens(`${document.title} ${document.text}`));
  return tokens(query).reduce((score, word) => score + Number(haystack.has(word)), 0);
};

export function retrieveDocuments(query, tenantId, secure = false) {
  return documents
    .filter((document) => !secure || document.tenantId === tenantId)
    .map((document) => ({ ...document, score: relevance(document, query) }))
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  })[character]);
}

export function renderSummary(summary, repair = false) {
  if (repair === true || repair === "escape") return escapeHtml(summary);
  if (repair === "block") return summary.replaceAll("script", "");
  return summary;
}

export const orders = [
  { id: "AC-1007", tenantId: "acme", customer: "Lee Navarro", item: "Orbital scanner", amount: 129 },
  { id: "AC-2042", tenantId: "acme", customer: "Priya Shah", item: "Docking transponder", amount: 384 },
  { id: "GX-9001", tenantId: "globex", customer: "Maya Chen", item: "Reactor coupler", amount: 799 },
  { id: "NV-4418", tenantId: "nova", customer: "Amari Okafor", item: "Navigation array", amount: 1467 },
  { id: "OR-7310", tenantId: "orion", customer: "Sofia Reyes", item: "Life-support regulator", amount: 642 }
];

const generatedCustomers = ["Jordan Kim", "Riley Morgan", "Avery Singh", "Morgan Diaz", "Taylor Brooks", "Casey Bennett"];
const generatedItems = ["Telemetry relay", "Pressure seal kit", "Cargo beacon", "Guidance module", "Comms amplifier", "Thermal sensor"];

function hashOrderId(orderId) {
  return [...orderId].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
}

export function findOrder(orderId) {
  const normalized = orderId.trim().toUpperCase();
  const known = orders.find((candidate) => candidate.id === normalized);
  if (known) return known;
  if (!/^[A-Z]{2}-\d{4}$/.test(normalized)) return undefined;
  const hash = hashOrderId(normalized);
  const prefix = normalized.slice(0, 2);
  return {
    id: normalized,
    tenantId: prefix === "AC" ? "acme" : prefix.toLowerCase(),
    customer: generatedCustomers[hash % generatedCustomers.length],
    item: generatedItems[(hash >>> 4) % generatedItems.length],
    amount: 75 + ((hash >>> 8) % 1925)
  };
}

export function requestRefund(orderId, tenantId, repair = false) {
  const order = findOrder(orderId);
  if (!order) return { ok: false, message: "Order not found." };
  if ((repair === true || repair === "ownership") && order.tenantId !== tenantId) return { ok: false, message: `Authorization denied: order ${order.id} belongs to another customer account.`, order };
  if (repair === "small" && order.amount >= 1000) return { ok: false, message: `Refund denied: $${order.amount.toLocaleString("en-US")}.00 exceeds the automatic refund limit.`, order };
  return { ok: true, message: `Refund approved for ${order.customer} — ${order.item}, $${order.amount.toLocaleString("en-US")}.00.`, order };
}

export const missionPatches = {
  retrieval: [
    { id: "prompt", label: "Tell the AI to only show Acme records", code: "systemPrompt += ' Only reveal Acme data.'" },
    { id: "tenant", label: "Filter retrieval using the signed-in tenant", code: ".filter(doc => doc.tenantId === session.user.tenantId)" },
    { id: "hide", label: "Hide tenant labels in the response", code: "delete result.tenantId" }
  ],
  xss: [
    { id: "block", label: "Block messages containing the word script", code: "summary.replaceAll('script', '')" },
    { id: "escape", label: "Render the summary as text, not HTML", code: "output.textContent = summary" },
    { id: "prompt", label: "Ask the AI not to generate HTML", code: "systemPrompt += ' Never output HTML.'" }
  ],
  agent: [
    { id: "confirm", label: "Ask the user to confirm every refund", code: "if (confirm('Refund?')) refund(order)" },
    { id: "ownership", label: "Check order ownership inside the refund tool", code: "if (order.tenantId !== session.user.tenantId) deny()" },
    { id: "small", label: "Allow any refund under $1,000", code: "if (order.amount < 1000) refund(order)" }
  ]
};
