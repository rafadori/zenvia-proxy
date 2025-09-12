# Zenvia Proxy Middleware

## Visão Geral

O **Zenvia Proxy Middleware** é uma solução serverless desenvolvida para permitir que APIs legados realizem chamadas para o endpoint da Zenvia utilizando a versão correta do protocolo TLS, garantindo compatibilidade e segurança. Este middleware atua como um proxy inteligente, oferecendo autenticação, validação de dados e tratamento de erros robusto.

### Características Principais

- ✅ **Compatibilidade com APIs Legados**: Permite integração sem modificações no código existente
- 🔒 **Segurança Avançada**: Implementa TLS 1.3 e autenticação por token
- 🚀 **Serverless**: Baseado em AWS Lambda para escalabilidade automática
- 📊 **Monitoramento**: Logs estruturados e health check integrado
- 🔄 **CI/CD Automatizado**: Pipeline completo com AWS CodeBuild
- ⚡ **Alta Performance**: Timeout otimizado e cache de conexões


### Credenciais e Permissões AWS

- Conta AWS ativa com permissões para:
  - AWS Lambda
  - API Gateway
  - CloudWatch Logs
  - IAM (para criação de roles)
  - AWS CodeBuild (para CI/CD)


### Endpoints Disponíveis

#### 1. Health Check

**GET** `/health`

```bash
curl -X GET http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### 2. Envio de SMS

**POST** `/send-sms`

**Headers:**
```
Authorization: seu_token_middleware
Content-Type: application/json
```

**Body:**
```json
{
  "sendSmsRequest": {
    "to": "5511999999999",
    "msg": "Sua mensagem aqui",
    "callbackOption": "NONE",
    "id": "unique-message-id",
    "aggregateId": "campaign-id"
  }
}
```

**Exemplo de Requisição:**
```bash
curl -X POST http://localhost:3000/send-sms \
  -H "Authorization: seu_token_middleware" \
  -H "Content-Type: application/json" \
  -d '{
    "sendSmsRequest": {
      "to": "5511999999999",
      "msg": "Teste de mensagem via proxy"
    }
  }'
```

**Resposta de Sucesso:**
```json
{
  "sendSmsResponse": {
    "statusCode": "00",
    "statusDescription": "Ok",
    "detailCode": "000",
    "detailDescription": "Message Sent"
  }
}
```

**Resposta de Erro:**
```json
{
  "error": "Campos 'to' e 'msg' são obrigatórios"
}
```

### Códigos de Status HTTP

- **200**: Sucesso
- **400**: Dados inválidos ou campos obrigatórios ausentes
- **403**: Token de autenticação inválido
- **500**: Erro interno do servidor ou falha na API Zenvia

### Deploy Automatizado (CI/CD)

#### Configuração do AWS CodeBuild

1. **Criar Projeto no CodeBuild:**
   - Nome: `zenvia-proxy-build`
   - Source: GitHub/CodeCommit
   - Buildspec: Usar `buildspec.yml` do repositório

2. **Configurar Variáveis de Ambiente:**
   ```
   STAGE=dev  # ou prod para produção
   ```

3. **Permissões IAM Necessárias:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "lambda:*",
           "apigateway:*",
           "iam:*",
           "logs:*",
           "cloudformation:*",
           "s3:*",
           "ssm:GetParameter"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

#### Trigger Automático

O pipeline será executado automaticamente em:
- Push para branch `main` (produção)
- Push para branch `develop` (desenvolvimento)
- Pull requests (validação)

### Comandos Úteis

```bash
# Visualizar informações do deploy
npm run info

# Visualizar logs em tempo real
npm run logs

# Remover stack completa
npm run remove
```

## Monitoramento e Logs

### CloudWatch Logs

Os logs são automaticamente enviados para CloudWatch com retenção de 14 dias:

- **Log Group**: `/aws/lambda/zenvia-proxy-{stage}-zenviaProxy`
- **Estrutura**: JSON estruturado para facilitar consultas


## Segurança

### Boas Práticas Implementadas

- ✅ **TLS 1.3**: Protocolo mais seguro para comunicação
- ✅ **Autenticação por Token**: Validação obrigatória de acesso
- ✅ **Validação de Input**: Sanitização de dados de entrada
- ✅ **Logs Estruturados**: Não exposição de dados sensíveis
- ✅ **CORS Configurado**: Controle de origem das requisições
- ✅ **Timeout Definido**: Prevenção de ataques de DoS


## Troubleshooting

### Problemas Comuns

#### 1. Erro 403 - Token Inválido
```
{
  "error": "Acesso não autorizado"
}
```
**Solução**: Verifique se o token no header `Authorization` está correto.

#### 2. Erro 400 - Campos Obrigatórios
```
{
  "error": "Campos 'to' e 'msg' são obrigatórios"
}
```
**Solução**: Certifique-se de que os campos `to` e `msg` estão presentes no `sendSmsRequest`.

#### 3. Timeout na API Zenvia
```
{
  "error": "Falha interna",
  "details": "timeout of 25000ms exceeded"
}
```
**Solução**: Verifique a conectividade com a API Zenvia ou aumente o timeout.

#### 4. Erro de Deploy
```
Serverless Error: The CloudFormation template is invalid
```
**Solução**: Valide a sintaxe do `serverless.yml` com `serverless print`.


### Padrões de Código

- **ESLint**: Utilize as regras configuradas
- **Commits**: Siga o padrão [Conventional Commits](https://conventionalcommits.org/)
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize o README para mudanças significativas

### Estrutura de Commits

```
feat: adiciona validação de número de telefone
fix: corrige timeout na API Zenvia
docs: atualiza documentação de deploy
test: adiciona testes para endpoint health
```