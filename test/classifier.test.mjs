import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { trainClassifier } from "../src/classifier.mjs";
import { evaluateClassifier } from "../src/evaluation.mjs";
import { readJsonLines } from "../src/jsonl.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const training = readJsonLines(path.join(projectRoot, "data", "training.jsonl"));
const evaluation = readJsonLines(path.join(projectRoot, "data", "evaluation.jsonl"));

test("classifica exemplos claros nas quatro categorias", () => {
  const classifier = trainClassifier(training);
  assert.equal(classifier.predict("fatura cobrada duas vezes").category, "billing");
  assert.equal(classifier.predict("rastreio da entrega atrasou").category, "delivery");
  assert.equal(classifier.predict("recuperar senha da conta").category, "account");
  assert.equal(classifier.predict("produto quebrado para troca").category, "product");
});

test("mede desempenho apenas no conjunto fictício versionado", () => {
  const classifier = trainClassifier(training);
  const metrics = evaluateClassifier(classifier, evaluation);
  assert.equal(metrics.examples, 12);
  assert.ok(metrics.accuracy >= 0.75);
});

