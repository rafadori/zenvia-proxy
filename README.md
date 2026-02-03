# Zenvia Proxy – Middleware Serverless para Compatibilidade TLS

Este projeto resolve um **problema comum em ambientes legados**:  
sistemas que **não suportam versões modernas de TLS (ex: TLS 1.2+)**, mas precisam se integrar com APIs externas que **exigem padrões atuais de segurança**.

O **Zenvia Proxy** atua como um **middleware serverless na AWS**, criando uma **camada de compatibilidade TLS** entre:

- 🏚️ **Sistemas legados** (TLS antigo / restrições técnicas)
- ☁️ **APIs modernas** (TLS atualizado, compliance e boas práticas)

> ⚠️ **Importante:**  
> Este repositório **não é apenas código de API**.  
> Ele é uma solução **100% autônoma de provisionamento**.
>
> 👉 **Nenhum recurso precisa ser criado manualmente no Console da AWS**  
> 👉 **Lambda, API Gateway, IAM e Logs são gerados automaticamente**  
> 👉 **Clone → Deploy → Infra pronta**

A solução utiliza **AWS Lambda + API Gateway**, eliminando servidores, reduzindo custos e garantindo **segurança, escalabilidade e isolamento do ambiente legado**.

---

## 🤖 Provisionamento 100% Automático (Zero Console AWS)

Este projeto utiliza **Infrastructure as Code (IaC)** com o **Serverless Framework**.

Ao executar o deploy:

- ❌ Não é necessário criar Lambda manualmente
- ❌ Não é necessário criar API Gateway manualmente
- ❌ Não é necessário configurar IAM
- ❌ Não é necessário configurar logs ou rotas
- ❌ Não é necessário acessar o Console da AWS

Todo o provisionamento é feito **exclusivamente via código**, a partir do arquivo `serverless.yml`.

O único requisito é possuir **credenciais AWS válidas**.

---

## 🏗️ Arquitetura – Camada de Compatibilidade TLS

Fluxo de comunicação:

```

Sistema Legado
(TLS antigo)
↓
API Gateway (TLS moderno)
↓
AWS Lambda (Proxy / Validação)
↓
Zenvia API (TLS atualizado)

```

Fluxo de provisionamento:

```

Git Clone
↓
serverless deploy
↓
AWS CloudFormation
↓
Lambda + API Gateway criados automaticamente

```

---

### 1. Computação (AWS Lambda)

- **Função:** `zenviaProxy`
- **Runtime:** Node.js 20.x
- **Papel:** Middleware de compatibilidade e segurança
- **Características:** Escalabilidade automática, sem servidores para gerenciar

---

### 2. Networking (Amazon API Gateway)

- **Tipo:** HTTP API (v2)
- **Função:** Expor o proxy de forma segura para o sistema legado
- **Configuração:**
  - TLS moderno
  - CORS habilitado
  - Rotas definidas (`/send-sms`, `/health`)

---

### 3. Observabilidade (Amazon CloudWatch)

- **Log Groups:** Criados automaticamente
- **Finalidade:** Auditoria, troubleshooting e rastreabilidade
- **Retenção:** 14 dias (otimização de custos)

---

### 4. Segurança (AWS IAM + TLS Moderno)

- Comunicação externa protegida com **TLS atualizado**, independentemente das limitações do sistema legado
- **Isolamento completo** do ambiente legado
- **Princípio de privilégio mínimo** para execução da Lambda
- Logs centralizados para auditoria

---
