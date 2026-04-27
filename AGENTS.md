# Regras para Agentes (AGENTS.md)

Para evitar problemas de permissão e garantir que os comandos rodem com as mesmas versões de dependências do servidor, os comandos deste projeto devem ser executados **dentro do Docker**.

## Container Principal: `bt-workspace-1`

- **Comandos de Backend (Laravel):**
  Devem ser executados no caminho `/var/www/api` dentro do container `bt-workspace-1`.
  Exemplo: `docker exec bt-workspace-1 bash -c "cd /var/www/api && php artisan serve"` ou `docker exec bt-workspace-1 bash -c "cd /var/www/api && composer require <package>"`

- **Comandos de Frontend (Quasar/Vue):**
  Devem ser executados no caminho `/var/www/spa` dentro do container `bt-workspace-1`.
  Exemplo: `docker exec bt-workspace-1 bash -c "cd /var/www/spa && npm install"` ou `docker exec bt-workspace-1 bash -c "cd /var/www/spa && npm run dev"`

Sempre priorize a execução via Docker ao invés de rodar comandos (`npm`, `composer`, `php`, etc.) diretamente na máquina local (`host`).

## Referência de Design (Design System)

- **Consultar Design System:** SEMPRE que for criar ou modificar telas e componentes, você DEVE consultar o arquivo `docs/design_system.md`. Ele contém a paleta de cores, tipografia, padrões de layout (Auth, Main, Admin) e referências de componentes que devem ser seguidos para manter a consistência visual do projeto.

## Critério de Aceite e Qualidade

- **Build de Validação:** SEMPRE que terminar uma implementação ou alteração significativa, você DEVE rodar o comando de build (`npm run build`) para garantir que o código está íntegro e não possui erros de compilação ou linting. O sucesso do build é um critério obrigatório para a conclusão da tarefa.
