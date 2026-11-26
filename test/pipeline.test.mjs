import assert from "node:assert/strict";
import test from "node:test";
import { trainClassifier } from "../src/classifier.mjs";
import { triageTickets } from "../src/pipeline.mjs";

const classifier = trainClassifier([
  { category: "billing", text: "cobrança cartão fatura estorno pagamento" },
  { category: "delivery", text: "entrega pedido rastreio transportadora atraso" },
  { category: "account", text: "conta email login senha cadastro" },
  { category: "product", text: "produto defeito troca garantia tamanho" },
]);

test("sanitiza antes de produzir a saída e evita duplicidade", () => {
  const result = triageTickets(
    [
      { id: "A-1", subject: "Entrega", body: "PED-12345 para pessoa@example.com está atrasado" },
      { id: "A-1", subject: "Repetido", body: "não deve ser processado" },
    ],
    classifier,
    { confidenceThreshold: 0.5 },
  );
  assert.equal(result.routed.length, 1);
  assert.equal(result.skipped.length, 1);
  assert.match(result.routed[0].sanitized_body, /\[ORDER_ID\].*\[EMAIL\]/u);
  assert.doesNotMatch(JSON.stringify(result), /pessoa@example\.com/u);
});

test("risco alto exige revisão humana mesmo com categoria confiante", () => {
  const result = triageTickets(
    [{ id: "A-2", subject: "Fraude", body: "conta invadida e cobrança duplicada no cartão" }],
    classifier,
  );
  assert.equal(result.routed[0].urgency, "high");
  assert.equal(result.routed[0].route, "human_review");
});

test("marcadores de sanitização não distorcem a categoria", () => {
  const result = triageTickets(
    [
      {
        id: "A-3",
        subject: "Cobrança duplicada",
        body: "Cartão cobrado duas vezes no PED-12345, contato pessoa@example.com",
      },
    ],
    classifier,
    { confidenceThreshold: 0.5 },
  );
  assert.equal(result.routed[0].category, "billing");
});

test("registro inválido vai para dead letter", () => {
  const result = triageTickets([{ id: 42, subject: "Inválido", body: "texto" }], classifier);
  assert.deepEqual(result.dead_letter, [{ id: 42, reason: "invalid_schema" }]);
});

