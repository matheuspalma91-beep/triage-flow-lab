const rules = [
  { label: "email", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu, replacement: "[EMAIL]" },
  { label: "phone", pattern: /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[-\s]?\d{4}/gu, replacement: "[PHONE]" },
  { label: "order", pattern: /\b(?:PED|ORDER)[-_ ]?\d{4,}\b/giu, replacement: "[ORDER_ID]" },
];

export function sanitizeText(text) {
  let sanitized = String(text);
  const redactions = {};

  for (const rule of rules) {
    const matches = sanitized.match(rule.pattern) ?? [];
    redactions[rule.label] = matches.length;
    sanitized = sanitized.replace(rule.pattern, rule.replacement);
  }

  return { sanitized, redactions };
}

