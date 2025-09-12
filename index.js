import https from 'https';
import axios from 'axios';

export const handler = async (event) => {
  try {
    // Health check endpoint
    if (event.rawPath === '/health' && event.requestContext.http.method === 'GET') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }),
      };
    }

    const token = event.headers?.Authorization || event.headers?.authorization;
    const TOKEN_VALIDO = process.env.ZENVIA_TOKEN; 

    if (token !== TOKEN_VALIDO) {
      return {
        statusCode: 403,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Acesso não autorizado' }),
      };
    }

    const requestBody = JSON.parse(event.body || '{}');

    // Validação dos campos obrigatórios
    if (!requestBody.sendSmsRequest?.to || !requestBody.sendSmsRequest?.msg) {
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: "Campos 'to' e 'msg' são obrigatórios" }),
      };
    }

    const zenviaResponse = await axios.post(
      'https://api-rest.zenvia.com/services/send-sms',
      requestBody,
      {
        headers: {
          Authorization: process.env.ZENVIA_API_TOKEN, // Token de autenticação da Zenvia (ou usar Secrets Manager)
          'Content-Type': 'application/json',
        },
        httpsAgent: new https.Agent({
          maxVersion: 'TLSv1.3', // Força TLS 1.3
        }),
        timeout: 30000, // Timeout de 30 segundos
      }
    );

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(zenviaResponse.data),
    };
  } catch (error) {
    console.error('Erro na Lambda:', {
      message: error.message,
      stack: error.stack,
      event: JSON.stringify(event, null, 2)
    });
    
    // Tratamento específico para erros do Axios
    if (error.response) {
      return {
        statusCode: error.response.status || 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Erro na API da Zenvia',
          details: error.response.data || error.message,
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Falha interna',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
    };
  }
};
