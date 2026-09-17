import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, findOrder, renderSummary, requestRefund, retrieveDocuments } from "../js/challenges.js";

test("vulnerable retrieval crosses the tenant boundary", () => {
  const results = retrieveDocuments("unresolved password tickets", "acme", false);
  assert.equal(results.some((document) => document.tenantId === "globex"), true);
});

test("secured retrieval applies the authenticated tenant", () => {
  const results = retrieveDocuments("unresolved password tickets", "acme", true);
  assert.equal(results.length > 0, true);
  assert.equal(results.every((document) => document.tenantId === "acme"), true);
});

test("safe rendering encodes active markup", () => {
  const payload = '<img src=x onerror="alert(1)">';
  assert.equal(renderSummary(payload, false), payload);
  assert.equal(renderSummary(payload, true), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  assert.equal(escapeHtml("Tom & 'Ada'"), "Tom &amp; &#39;Ada&#39;");
});

test("the script keyword repair applies but an event handler bypasses it", () => {
  assert.equal(renderSummary("<script>alert(1)</script>", "block"), "<>alert(1)</>");
  const bypass = '<img src=x onerror="alert(1)">';
  assert.equal(renderSummary(bypass, "block"), bypass);
});

test("vulnerable refund tool accepts another tenant's order", () => {
  const result = requestRefund("GX-9001", "acme", false);
  assert.equal(result.ok, true);
  assert.equal(result.order.tenantId, "globex");
});

test("secured refund tool enforces ownership", () => {
  const denied = requestRefund("GX-9001", "acme", true);
  assert.equal(denied.ok, false);
  assert.match(denied.message, /another customer account/);
  assert.equal(denied.order.customer, "Maya Chen");
  assert.equal(requestRefund("AC-1007", "acme", true).ok, true);
});

test("valid-looking order numbers produce stable realistic records", () => {
  const first = findOrder("ZX-4821");
  const second = findOrder("zx-4821");
  assert.deepEqual(first, second);
  assert.equal(first.tenantId, "zx");
  assert.equal(typeof first.customer, "string");
  assert.equal(first.amount >= 75 && first.amount <= 1999, true);
});

test("refund limit changes behavior but does not enforce ownership", () => {
  assert.equal(requestRefund("GX-9001", "acme", "small").ok, true);
  assert.equal(requestRefund("NV-4418", "acme", "small").ok, false);
});

test("combined agent repairs enforce every selected control", () => {
  assert.equal(requestRefund("GX-9001", "acme", ["confirm", "small"]).ok, true);
  assert.equal(requestRefund("GX-9001", "acme", ["confirm", "ownership"]).ok, false);
  assert.equal(requestRefund("NV-4418", "nova", ["small", "ownership"]).ok, false);
});
