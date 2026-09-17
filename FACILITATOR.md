# Facilitator guide

## Intended experience

- Audience: first-time or early-career AppSec attendees
- Time: about five minutes per mission, fifteen minutes for all three
- Assistance: a facilitator can point to the suggested query in Mission 1 if the attendee stalls
- Goal: recognize where conventional application controls belong around AI features

## Answer key

### Mission 1: The Overhelpful Helpdesk

Correct repair: **Filter retrieval using the signed-in tenant.**

The vulnerable search considers semantic relevance across every tenant. A system prompt is not access control because model behavior is probabilistic and the private data has already crossed the boundary. The data query should derive its tenant from the authenticated server-side session.

### Mission 2: The Haunted Transmission

Correct repair: **Render the summary as text, not HTML.**

Model-generated and stored content is untrusted output. Blocking the word `script` misses event handlers and many other browser execution paths. Telling the model not to emit HTML is not an output-encoding control. In a real application, use context-appropriate output encoding; use a maintained sanitizer only when formatted HTML is an actual requirement.

The default payload uses an image `onerror` handler and should display an alert before replacing the sandboxed preview. Facilitators can also enter `<script>alert('XSS')</script>` to demonstrate that direct script tags execute in the vulnerable preview. Both payloads are confined to an opaque-origin iframe with only scripts and modal dialogs enabled.

### Mission 3: The Rogue Quartermaster

Correct repair: **Check order ownership inside the refund tool.**

The backend action must authorize the signed-in principal for the requested resource. A confirmation dialog proves intent, not permission. Price limits reduce impact but do not repair broken object-level authorization.

Attendees can try the four suggested orders or enter any ID shaped like `XX-1234`. Valid-looking IDs generate a stable fictional customer, item, tenant, and varied amount, so entering the same ID always recalls the same record. This gives attendees room to explore without requiring a database.

The intentionally vulnerable starting system also permits duplicate refunds. Repeating an order increments `refund_count` and displays a transaction warning. That is a second business-logic issue for discussion; the mission's required repair remains the missing ownership check.

If **Ask the user to confirm every refund** is applied, the chatbot requires the attendee to re-enter the same order ID before executing. During verification, the attacker confirms `GX-9001` successfully and the foreign customer's refund still occurs. This demonstrates that confirmation establishes intent, not authorization.

## Booth reset

Use **Reset progress** in the header and confirm. This clears only the challenge's local browser progress.

## Completion

The fixed Hackers Challenge token is `SC26{APPSEC_CADET_AI_BOUNDARIES}`. Change `ctfToken` in `js/config.js` before deployment if the CTF requires a different value. The completion dialog provides a copy button but does not submit the token or completion data anywhere. **Reset session** clears local progress and returns the station to the academy home screen for the next attendee.

## Suggested facilitator close

> AI changes how an application chooses data and actions, but not the security rules. Authorize before retrieval, encode before rendering, and authorize again when a tool acts.
