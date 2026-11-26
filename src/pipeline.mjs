import { sanitizeText } from "./sanitizer.mjs";
import { detectUrgency } from "./urgency.mjs";

export function triageTickets(tickets, classifier, { confidenceThreshold = 0.65 } = {}) {
  const seen = new Set();
  const routed = [];
  const skipped = [];
  const deadLetter = [];

  for (const ticket of tickets) {
    if (!ticket || typeof ticket.id !== "string" || typeof ticket.subject !== "string" || typeof ticket.body !== "string") {
      deadLetter.push({ id: ticket?.id ?? null, reason: "invalid_schema" });
      continue;
    }
    if (seen.has(ticket.id)) {
      skipped.push({ id: ticket.id, reason: "duplicate_id" });
      continue;
    }
    seen.add(ticket.id);

    const subject = sanitizeText(ticket.subject);
    const body = sanitizeText(ticket.body);
    const safeText = `${subject.sanitized} ${body.sanitized}`;
    const classificationText = safeText
      .replaceAll(/(?:e-?mail|telefone|contato)\s*(?:e|é|:)?\s*\[(?:EMAIL|PHONE)\]/giu, " ")
      .replaceAll(/\[(?:EMAIL|PHONE|ORDER_ID)\]/gu, "");
    const prediction = classifier.predict(classificationText);
    const urgency = detectUrgency(safeText);
    const requiresHumanReview = urgency === "high" || prediction.confidence < confidenceThreshold;

    routed.push({
      id: ticket.id,
      sanitized_subject: subject.sanitized,
      sanitized_body: body.sanitized,
      category: prediction.category,
      confidence: Number(prediction.confidence.toFixed(4)),
      urgency,
      route: requiresHumanReview ? "human_review" : `queue:${prediction.category}`,
      redactions: {
        email: subject.redactions.email + body.redactions.email,
        phone: subject.redactions.phone + body.redactions.phone,
        order: subject.redactions.order + body.redactions.order,
      },
    });
  }

  return { routed, skipped, dead_letter: deadLetter };
}

