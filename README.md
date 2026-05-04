# zenvia-proxy

Middleware serverless para integração com a API Zenvia em ambientes que não suportam TLS moderno.

## O problema

Sistemas legados frequentemente travam em versões antigas de TLS e não conseguem se comunicar com APIs externas que exigem TLS 1.2+. Criar um túnel direto não é opção — e subir um servidor só pra isso é desperdício.

## A solução

Um proxy rodando no AWS Lambda, exposto via API Gateway. O sistema legado fala com o proxy (sem restrição de TLS do lado dele), e o proxy faz a chamada para a Zenvia com TLS atualizado.

Sistema legado → API Gateway → Lambda → Zenvia API

Sem servidores pra gerenciar. Sem custo fixo. Escala sozinho.

## Infraestrutura

Tudo provisionado via [Serverless Framework](https://www.serverless.com/). Um único `serverless deploy` cria:

- AWS Lambda (`zenviaProxy`, Node.js 20.x)
- API Gateway HTTP (rotas `/send-sms` e `/health`, CORS habilitado)
- IAM roles com privilégio mínimo
- CloudWatch Log Groups (retenção de 14 dias)

Nenhum recurso precisa ser criado manualmente no console da AWS.

## Pré-requisitos

- Node.js 20.x
- Serverless Framework instalado (`npm i -g serverless`)
- Credenciais AWS configuradas (`~/.aws/credentials` ou variáveis de ambiente)

## Deploy

```bash
git clone https://github.com/seu-usuario/zenvia-proxy
cd zenvia-proxy
npm install
serverless deploy
```

O CLI vai retornar a URL do endpoint ao final do deploy.

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/send-sms` | Encaminha requisição de SMS para a Zenvia |
| GET | `/health` | Healthcheck do proxy |

## Observabilidade

Logs disponíveis no CloudWatch em `/aws/lambda/zenviaProxy`. Útil para auditoria e debug sem precisar acessar a Lambda diretamente.

```bash
serverless logs -f zenviaProxy --tail
```

## Remover

```bash
serverless remove
```

Remove todos os recursos criados na AWS.
