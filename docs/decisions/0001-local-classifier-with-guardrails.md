# ADR 0001 — Classificador local com guardrails explícitos

- Status: aceito
- Data: 2026-11-26

## Contexto

Uma demo pública de triagem precisa ser reproduzível sem credenciais e não pode sugerir que texto sensível de usuários reais deva ser enviado automaticamente a um provedor externo.

## Decisão

Usar um classificador Multinomial Naive Bayes implementado localmente, treinado com exemplos fictícios. Antes da classificação, substituir padrões comuns de email, telefone e pedido. Depois da previsão, exigir revisão humana quando a confiança estiver abaixo do limite ou quando regras explícitas identificarem alto risco.

## Consequências

### Positivas

- execução offline, sem token e sem custo;
- comportamento determinístico e coberto por testes;
- separação clara entre previsão e decisão operacional;
- texto detectado como sensível não aparece no artefato final.

### Negativas

- o modelo não representa linguagem real de atendimento;
- regex produz falsos positivos e falsos negativos;
- confiança estatística não equivale a segurança;
- categorias e regras precisam de governança antes de qualquer uso real.

## Alternativas consideradas

- LLM externo: acrescentaria custo, credenciais, disponibilidade e avaliação de privacidade;
- somente regras: seria simples, mas não demonstraria separação entre modelo e guardrail;
- modelo pré-treinado: aumentaria dependências e dificultaria uma execução curta e auditável.

