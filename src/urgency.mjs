const highRisk = /fraude|cobranca duplicada|cobrança duplicada|pegou fogo|vazamento|conta invadida/iu;
const mediumRisk = /atrasad|erro|nao funciona|não funciona|estorno|bloquead|defeito/iu;

export function detectUrgency(text) {
  if (highRisk.test(text)) return "high";
  if (mediumRisk.test(text)) return "medium";
  return "low";
}

