# Critérios de Aceite de Segurança

> Definido pelo Roberto em 07/10/2026. É o padrão contra o qual o código da migração
> será medido — não é recomendação, é critério de aceite. Nenhuma entrega é considerada
> pronta sem atender ao que está aqui.

## Migração Next.js → WordPress

### 1. Autenticação

**AC-01 — Autenticação nativa**

Toda autenticação de usuários deverá utilizar os mecanismos nativos do WordPress ou mecanismos oficialmente integrados a ele.

**Verificação:**

* Não deve existir implementação própria de login/sessão equivalente ao sistema nativo.
* Não devem existir tokens de autenticação armazenados em `localStorage` ou `sessionStorage`.
* O fluxo de login/logout deve utilizar as APIs e mecanismos de sessão do WordPress.

---

### 2. Autorização e permissões

**AC-02 — Nenhuma operação privilegiada depende apenas do frontend**

Toda operação que cria, altera, exclui ou consulta dados protegidos deve verificar a permissão no servidor.

**Verificação:**

* Alterar/remover controles de interface não deve permitir uma operação não autorizada.
* Requisições HTTP podem ser reproduzidas manualmente sem que isso permita contornar permissões.

---

**AC-03 — Capability check obrigatório**

Toda operação administrativa ou sensível deve verificar explicitamente a capability necessária.

Exemplo:

```php
if (!current_user_can('edit_post', $post_id)) {
    wp_die('Forbidden', '', ['response' => 403]);
}
```

**Verificação:**

* Testar a operação como administrador.
* Testar como usuário autorizado sem privilégios administrativos.
* Testar como usuário não autorizado.
* Testar como usuário não autenticado.

O último grupo deve receber `401`/`403` ou ser redirecionado conforme o fluxo definido, sem executar a operação.

---

**AC-04 — Autorização no nível do recurso**

Quando uma operação envolve um objeto específico, a permissão deve ser validada para aquele objeto.

Exemplo:

```text
POST /editar-modelo
model_id=123
```

Não é suficiente verificar apenas se o usuário pode editar "modelos". Deve ser verificado se ele pode editar **o modelo 123**.

**Verificação:**

* Usuário A tenta alterar um recurso pertencente ao usuário B.
* A requisição deve ser rejeitada.
* Alterar manualmente o ID do recurso na requisição não deve permitir acesso indevido.

---

### 3. Proteção contra CSRF

**AC-05 — Nonce em operações que alteram estado**

Toda requisição originada pelo navegador que altere estado deve possuir proteção contra CSRF utilizando nonce apropriado.

Aplica-se a:

* criação;
* edição;
* exclusão;
* alteração de permissões;
* upload;
* alteração de configurações;
* ações administrativas;
* endpoints AJAX;
* endpoints REST que utilizem autenticação baseada em cookies.

**Verificação:**
Para cada endpoint protegido:

1. requisição válida + nonce válido → operação permitida;
2. nonce ausente → operação rejeitada;
3. nonce inválido → operação rejeitada;
4. nonce expirado/incompatível → operação rejeitada.

---

### 4. Validação e sanitização de entrada

**AC-06 — Nenhuma entrada do cliente é considerada confiável**

Todo dado recebido do cliente deve ser validado de acordo com o tipo e as regras de negócio antes de ser utilizado.

Exemplos:

```php
$id = absint($_POST['id']);
```

```php
$email = sanitize_email($_POST['email']);

if (!is_email($email)) {
    // rejeitar
}
```

**Verificação:**
Testar:

* valores vazios;
* tipos incorretos;
* números negativos;
* IDs inexistentes;
* strings excessivamente grandes;
* valores fora do intervalo permitido;
* campos inesperados;
* parâmetros adicionais;
* valores manipulados manualmente.

---

**AC-07 — Sanitização não substitui validação**

O sistema não deve considerar um valor seguro apenas porque passou por `sanitize_*()`.

**Verificação:**
Cada campo crítico deve possuir regras explícitas de:

* tipo;
* formato;
* intervalo;
* valores permitidos;
* relacionamento com outros dados.

---

### 5. Escaping e saída

**AC-08 — Dados dinâmicos são escapados no contexto correto**

Todo dado controlado pelo usuário ou proveniente do banco deve ser escapado antes de ser enviado para HTML, atributo HTML, URL ou JavaScript, conforme o contexto.

Exemplos:

```php
esc_html()
esc_attr()
esc_url()
esc_js()
wp_json_encode()
```

**Verificação:**
Inserir payloads de teste contendo HTML/JavaScript em campos que posteriormente são exibidos.

O conteúdo deve ser tratado como dado e não executado como código.

---

### 6. SQL e acesso ao banco

**AC-09 — Queries não concatenam entrada do usuário diretamente**

Toda consulta SQL que utilize dados externos deve utilizar `$wpdb->prepare()` ou APIs apropriadas do WordPress.

**Verificação:**

* Revisão de código procurando concatenação de parâmetros em SQL.
* Testes com caracteres e payloads típicos de SQL injection.
* Nenhuma entrada do cliente deve alterar a estrutura da query.

---

### 7. APIs, AJAX e endpoints

**AC-10 — Todo endpoint possui política de acesso explícita**

Cada endpoint customizado deve documentar:

* quem pode acessá-lo;
* quais dados recebe;
* quais dados retorna;
* quais capabilities são necessárias;
* se exige autenticação;
* se exige nonce;
* quais validações são realizadas.

**Verificação:**
Deve existir uma lista de todos os endpoints customizados e seus respectivos controles.

---

**AC-11 — Endpoints não expõem dados além do necessário**

Respostas de AJAX/REST devem retornar somente os dados necessários para o funcionamento da interface.

**Verificação:**

* Testar endpoints como usuário comum.
* Testar endpoints sem autenticação.
* Verificar se IDs internos, e-mails, metadados privados, tokens ou outras informações desnecessárias são expostos.

---

### 8. Manipulação de arquivos e uploads

**AC-12 — Uploads são validados no servidor**

Arquivos enviados pelo usuário devem possuir validação de:

* extensão;
* MIME type;
* tamanho;
* finalidade;
* usuário autorizado;
* local de armazenamento.

**Verificação:**
Tentar enviar:

* extensão não permitida;
* arquivo com MIME manipulado;
* arquivo excessivamente grande;
* arquivo executável;
* arquivo contendo conteúdo inesperado.

Nenhum arquivo não autorizado deve ser armazenado ou executado.

---

### 9. Dados sensíveis e segredos

**AC-13 — Secrets não estão presentes no código ou frontend**

Nenhuma senha, API key, token ou segredo deve estar:

* no código-fonte;
* no JavaScript enviado ao navegador;
* em HTML;
* em respostas de API;
* em logs;
* em repositório público.

**Verificação:**
Executar secret scanning no repositório e revisar variáveis de ambiente/configuração.

---

### 10. Dependências e plugins

**AC-14 — Plugins e dependências possuem origem e manutenção conhecidas**

Todo plugin utilizado deve possuir justificativa de uso e ser mantido em versão suportada.

**Verificação:**
Criar inventário contendo:

| Componente | Versão | Finalidade | Origem  | Atualização       |
| ---------- | ------ | ---------- | ------- | ----------------- |
| WordPress  | X      | Core       | Oficial | Automática/manual |
| Plugin A   | X      | Função     | Oficial | Manual            |
| Plugin B   | X      | Função     | Oficial | Manual            |

Plugins desnecessários devem ser removidos.

---

**AC-15 — Vulnerabilidades conhecidas devem ser tratadas**

A versão final do sistema não deve possuir vulnerabilidades conhecidas classificadas como impeditivas pela política de segurança do projeto.

**Verificação:**
Executar scanner de vulnerabilidades no:

* WordPress;
* plugins;
* tema;
* dependências;
* bibliotecas JavaScript;
* servidor/PHP, quando aplicável.

---

### 11. Configuração do WordPress

**AC-16 — Ambiente de produção possui configuração endurecida**

Devem ser avaliados, no mínimo:

* versão suportada do PHP;
* HTTPS obrigatório;
* configurações de cookies;
* exposição do ambiente de debug;
* permissões de arquivos;
* usuários administrativos;
* plugins ativos;
* temas instalados;
* XML-RPC;
* REST API;
* uploads;
* backups;
* cabeçalhos de segurança;
* exposição de informações de versão.

---

### 12. Erros e logs

**AC-17 — Erros internos não são expostos ao usuário**

Mensagens de erro em produção não devem revelar:

* stack traces;
* caminhos internos;
* queries SQL;
* credenciais;
* tokens;
* detalhes da infraestrutura.

**Verificação:**
Forçar erros conhecidos e verificar a resposta apresentada ao usuário.

---

**AC-18 — Eventos relevantes podem ser auditados**

Operações sensíveis devem possuir mecanismo adequado de registro/auditoria quando exigido pelo projeto.

Exemplos:

* alteração de permissões;
* exclusão de registros;
* alteração de dados críticos;
* criação/exclusão de usuários;
* ações administrativas.

Os logs não devem armazenar segredos ou dados sensíveis desnecessariamente.

---

### 13. Controle de sessão

**AC-19 — Logout invalida a sessão adequadamente**

Após logout, o usuário não deve conseguir continuar utilizando recursos autenticados através de uma sessão válida.

**Verificação:**

* Efetuar login.
* Capturar uma requisição autenticada.
* Efetuar logout.
* Repetir a requisição.
* A operação deve ser rejeitada.

---

**AC-20 — Usuário não consegue elevar seus próprios privilégios**

Um usuário comum não deve conseguir alterar seu próprio role/capabilities através de:

* requisições HTTP;
* parâmetros manipulados;
* endpoints REST/AJAX;
* campos ocultos;
* alteração de IDs.

---

### 14. Segurança específica da migração

**AC-21 — Nenhuma regra de segurança existente é perdida na migração**

Para cada funcionalidade existente no Next.js, deve ser identificado:

```text
Funcionalidade
↓
Quem pode executar?
↓
Quais dados pode acessar?
↓
Quais dados pode alterar?
↓
Quais validações existem?
↓
Como isso será implementado no WordPress?
```

**Verificação:**
Manter uma matriz de permissões comparando o sistema antigo e o novo.

---

**AC-22 — Testes de autorização são realizados antes do go-live**

Para cada funcionalidade protegida, testar pelo menos:

| Cenário                                           | Resultado esperado |
| ------------------------------------------------- | ------------------ |
| Admin autorizado                                  | Permitido          |
| Usuário autorizado                                | Permitido          |
| Usuário sem permissão                             | Negado             |
| Usuário tentando acessar recurso de outro usuário | Negado             |
| Não autenticado                                   | Negado             |
| Nonce ausente                                     | Negado             |
| Nonce inválido                                    | Negado             |
| ID/recurso manipulado                             | Negado             |

---

### 15. Critério final de aceite

A migração não será considerada aprovada apenas por utilizar WordPress.

Para aprovação, devem ser atendidos simultaneamente:

1. autenticação utilizando mecanismos apropriados do WordPress;
2. autorização validada no servidor;
3. capability check em operações protegidas;
4. autorização no nível do recurso quando aplicável;
5. nonce/CSRF protection onde aplicável;
6. validação e sanitização das entradas;
7. escaping contextual das saídas;
8. queries protegidas contra SQL injection;
9. endpoints documentados e protegidos;
10. uploads adequadamente validados;
11. secrets fora do código e do frontend;
12. plugins e dependências inventariados e atualizados;
13. ambiente de produção endurecido;
14. erros internos não expostos;
15. testes de tentativa de acesso indevido realizados;
16. nenhuma vulnerabilidade crítica/impeditiva conhecida na versão liberada;
17. matriz de permissões da aplicação validada;
18. evidências dos testes armazenadas para auditoria.

### Princípio de aceite

**A segurança não será considerada uma propriedade do WordPress, mas uma propriedade do conjunto:**

**WordPress + configuração do ambiente + plugins + código próprio + modelo de autorização + validação + testes de segurança.**

A migração somente será considerada concluída quando for possível demonstrar, por testes ou inspeção, que cada controle acima está efetivamente implementado.

---

## Artefatos que estes critérios exigem

Quatro documentos precisam existir e ser mantidos, senão os critérios não são
verificáveis. Eles são entrega, não anexo:

| Artefato | Exigido por | Onde |
|---|---|---|
| Matriz de permissões (antigo × novo) | AC-21, AC-22 | `docs/seguranca/matriz-permissoes.md` |
| Inventário de endpoints | AC-10, AC-11 | `docs/seguranca/endpoints.md` |
| Inventário de plugins e dependências | AC-14, AC-15 | `docs/seguranca/inventario.md` |
| Evidências dos testes de autorização | AC-22, critério final 18 | `docs/seguranca/evidencias/` |
