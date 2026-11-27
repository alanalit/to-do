# Organize.se — lista de tarefas

Aplicação simples de lista de tarefas feita para praticar os fundamentos de JavaScript no navegador. O projeto não usa frameworks, dependências, serviços externos ou etapa de compilação.

## Integrantes

- Alana Lima Tavares

## Recursos

- Adicionar tarefas com validação de campos vazios.
- Marcar tarefas como concluídas e reabri-las.
- Editar e remover tarefas.
- Filtrar por todas, pendentes e concluídas, com contagens atualizadas.
- Manter as tarefas salvas no navegador após recarregar a página.
- Usar a interface em telas pequenas e navegar pelos controles com teclado.

## Tecnologias

- HTML semântico
- CSS puro e responsivo
- JavaScript nativo com módulos (`type="module"`)
- `localStorage` e JSON para persistência local

## Como executar

Os módulos JavaScript devem ser servidos por um servidor estático. Não é necessário instalar dependências.

**VS Code:** abra a pasta `prova_js`, abra `index.html` e inicie a extensão Live Server. Confira se o endereço aberto corresponde à pasta `prova_js`.

**Python:** abra o terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois, acesse <http://localhost:8000> no navegador. Para encerrar o servidor, use `Ctrl+C` no terminal.

## Como os dados são armazenados

As tarefas ficam em um array de objetos com identificador, título, estado de conclusão e data de criação. A camada `js/storage.js` transforma o array em JSON com `JSON.stringify` e o grava no navegador usando a chave `todo.tasks.v1`. Na inicialização, lê o conteúdo com `JSON.parse` e valida o formato antes de entregá-lo à aplicação.

Dados ausentes iniciam uma lista vazia. JSON inválido e itens fora do formato esperado são ignorados com aviso. Falhas de leitura ou gravação também geram uma mensagem compreensível na interface.

## Limitações

- Os dados ficam no navegador e no perfil usados para acessar o app.
- Não há contas, sincronização entre dispositivos ou cópia de segurança remota.
- Dados do `localStorage` podem ser removidos pelo usuário ou pelo navegador.
- Cada origem do navegador tem seu próprio armazenamento. Por exemplo, outra porta, outro endereço ou outra pasta servida pelo Live Server pode mostrar uma lista diferente.

## Organização dos arquivos

- `index.html`: estrutura da página e controles da interface.
- `css/styles.css`: identidade visual, estados e layout responsivo.
- `js/app.js`: inicialização, seleção de elementos e eventos.
- `js/tasks.js`: regras para criar, consultar, atualizar e remover tarefas.
- `js/storage.js`: leitura, validação e gravação no `localStorage`.
- `js/ui.js`: renderização da lista, contadores e mensagens.