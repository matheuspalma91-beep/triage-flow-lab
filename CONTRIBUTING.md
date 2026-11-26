# Contribuindo

## Fluxo

1. Abra uma issue descrevendo o cenário e o risco.
2. Crie uma branch curta a partir de `main`.
3. Inclua teste para qualquer mudança em sanitização, classificação ou roteamento.
4. Execute `npm run check`.
5. Abra uma PR com problema, decisão, evidência e limitações.

## Regras de dados

- use somente exemplos fictícios e domínios reservados, como `example.com`;
- não copie chamados, prompts, nomes, emails ou identificadores reais;
- não adicione tokens nem integração externa sem um desenho de ameaça explícito;
- resultados do conjunto sintético nunca devem ser apresentados como métrica de produção;
- preserve revisão humana para risco alto e baixa confiança.

Use Conventional Commits. Questões de segurança seguem [SECURITY.md](SECURITY.md).

