import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { trainClassifier } from "../src/classifier.mjs";
import { evaluateClassifier } from "../src/evaluation.mjs";
import { readJsonLines } from "../src/jsonl.mjs";
import { triageTickets } from "../src/pipeline.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const training = readJsonLines(path.join(projectRoot, "data", "training.jsonl"));
const evaluation = readJsonLines(path.join(projectRoot, "data", "evaluation.jsonl"));
const inbox = readJsonLines(path.join(projectRoot, "data", "inbox.jsonl"));

const classifier = trainClassifier(training);
const metrics = evaluateClassifier(classifier, evaluation);
const triage = triageTickets(inbox, classifier);
const artifact = {
  generated_from: "entirely fictional local data",
  model: "multinomial_naive_bayes",
  evaluation: {
    examples: metrics.examples,
    correct: metrics.correct,
    accuracy: Number(metrics.accuracy.toFixed(4)),
  },
  summary: {
    routed: triage.routed.length,
    human_review: triage.routed.filter((ticket) => ticket.route === "human_review").length,
    skipped: triage.skipped.length,
    dead_letter: triage.dead_letter.length,
    redactions: triage.routed.reduce(
      (total, ticket) => total + Object.values(ticket.redactions).reduce((sum, count) => sum + count, 0),
      0,
    ),
  },
  ...triage,
};

const artifactsDir = path.join(projectRoot, "artifacts");
fs.mkdirSync(artifactsDir, { recursive: true });
fs.writeFileSync(path.join(artifactsDir, "triage-results.json"), `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
fs.mkdirSync(path.join(projectRoot, "docs"), { recursive: true });

const resultRows = triage.routed
  .map(
    (ticket) =>
      `| ${ticket.id} | ${ticket.category} | ${ticket.confidence.toFixed(2)} | ${ticket.urgency} | ${ticket.route} |`,
  )
  .join("\n");
const markdown = `# Resultado da demonstração

> Gerado por \`npm run demo\` com dados inteiramente fictícios. A acurácia abaixo descreve somente o pequeno conjunto sintético de avaliação.

## Resumo

| métrica | valor |
| --- | ---: |
| exemplos de avaliação | ${metrics.examples} |
| acertos no conjunto fictício | ${metrics.correct} |
| acurácia fictícia | ${(metrics.accuracy * 100).toFixed(1)}% |
| chamados roteados | ${artifact.summary.routed} |
| revisão humana | ${artifact.summary.human_review} |
| duplicados ignorados | ${artifact.summary.skipped} |
| registros inválidos | ${artifact.summary.dead_letter} |
| dados sensíveis substituídos | ${artifact.summary.redactions} |

## Roteamento

| id | categoria | confiança | urgência | destino |
| --- | --- | ---: | --- | --- |
${resultRows}

O artefato detalhado está em [artifacts/triage-results.json](../artifacts/triage-results.json). O texto bruto com email, telefone ou identificador de pedido não é copiado para a saída.
`;
fs.writeFileSync(path.join(projectRoot, "docs", "demo-results.md"), markdown, "utf8");

console.log(
  `Demo concluída: ${artifact.summary.routed} roteados, ${artifact.summary.human_review} para revisão humana, ${(metrics.accuracy * 100).toFixed(1)}% no conjunto fictício.`,
);

