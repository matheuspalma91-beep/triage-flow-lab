# Resultado da demonstração

> Gerado por `npm run demo` com dados inteiramente fictícios. A acurácia abaixo descreve somente o pequeno conjunto sintético de avaliação.

## Resumo

| métrica | valor |
| --- | ---: |
| exemplos de avaliação | 12 |
| acertos no conjunto fictício | 11 |
| acurácia fictícia | 91.7% |
| chamados roteados | 7 |
| revisão humana | 3 |
| duplicados ignorados | 1 |
| registros inválidos | 1 |
| dados sensíveis substituídos | 7 |

## Roteamento

| id | categoria | confiança | urgência | destino |
| --- | --- | ---: | --- | --- |
| TKT-001 | billing | 0.50 | high | human_review |
| TKT-002 | delivery | 0.89 | medium | queue:delivery |
| TKT-003 | account | 0.99 | low | queue:account |
| TKT-004 | product | 0.90 | low | queue:product |
| TKT-005 | account | 0.99 | high | human_review |
| TKT-006 | delivery | 0.54 | low | human_review |
| TKT-007 | product | 0.97 | medium | queue:product |

O artefato detalhado está em [artifacts/triage-results.json](../artifacts/triage-results.json). O texto bruto com email, telefone ou identificador de pedido não é copiado para a saída.
