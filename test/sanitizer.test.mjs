import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeText } from "../src/sanitizer.mjs";

test("remove email, telefone e identificador de pedido", () => {
  const result = sanitizeText(
    "Contato pessoa@example.com, (00) 00000-0000, pedido PED-12345.",
  );
  assert.equal(result.sanitized, "Contato [EMAIL], [PHONE], pedido [ORDER_ID].");
  assert.deepEqual(result.redactions, { email: 1, phone: 1, order: 1 });
});

test("mantém texto sem dados detectáveis", () => {
  const result = sanitizeText("O produto chegou com defeito.");
  assert.equal(result.sanitized, "O produto chegou com defeito.");
  assert.deepEqual(result.redactions, { email: 0, phone: 0, order: 0 });
});

test("não mascara uma sequência numérica curta como telefone", () => {
  const result = sanitizeText("Referência REF-12345 e versão 2026.11.");
  assert.equal(result.sanitized, "Referência REF-12345 e versão 2026.11.");
  assert.deepEqual(result.redactions, { email: 0, phone: 0, order: 0 });
});

