# Tech World — Deployment

Este documento prepara o repositório para produção sem criar ou implantar recursos externos.

## Arquitetura de produção

```text
Frontend Next.js (Vercel)
          ↓ HTTPS
Backend Java 21 / Spring Boot (container cloud)
          ├── MongoDB Atlas
          └── Kafka gerenciado
```

Frontend e backend são serviços independentes. MongoDB e Kafka devem ser provisionados antes do backend. O `docker-compose.yml` permanece exclusivo para desenvolvimento e demonstração local.

## Variáveis de ambiente

| Variable | Service | Required | Description |
|---|---|---:|---|
| `SPRING_PROFILES_ACTIVE` | Backend | Sim | Use `prod` no serviço público. |
| `MONGODB_URI` | Backend | Sim | URI completa do MongoDB externo, compatível com Atlas. |
| `JWT_SECRET` | Backend | Sim | Segredo aleatório com pelo menos 32 bytes. |
| `JWT_TOKEN_TTL` | Backend | Não | Duração ISO-8601 do token; padrão `PT2H`. |
| `ADMIN_USERNAME` | Backend | Sim | Usuário inicial da administração. Só é criado se a coleção estiver vazia. |
| `ADMIN_PASSWORD` | Backend | Sim | Senha forte usada apenas no bootstrap inicial. |
| `CORS_ALLOWED_ORIGINS` | Backend | Sim | Origens HTTPS explícitas, separadas por vírgula. `*` não é aceito. |
| `SERVER_PORT` | Backend | Condicional | Porta preferencial. Tem precedência sobre `PORT`. |
| `PORT` | Backend | Condicional | Porta fornecida pelo provedor quando `SERVER_PORT` não existir. Fallback final: `8080`. |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | Backend | Sim | Brokers externos separados por vírgula. |
| `ORDER_CREATED_TOPIC` | Backend | Não | Tópico do Lab; padrão `order-created`. |
| `KAFKA_SECURITY_PROTOCOL` | Backend | Sim | Normalmente `SASL_SSL` em Kafka gerenciado. |
| `KAFKA_SASL_MECHANISM` | Backend | Sim | Mecanismo do provedor, com padrão `PLAIN`. |
| `KAFKA_SASL_USERNAME` | Backend | Sim | Username/API key do Kafka. |
| `KAFKA_SASL_PASSWORD` | Backend | Sim | Password/API secret do Kafka. |
| `KAFKA_SASL_LOGIN_MODULE` | Backend | Não | Padrão `PlainLoginModule`; ajuste para mecanismos SCRAM quando exigido pelo provedor. |
| `NEXT_PUBLIC_API_URL` | Frontend | Sim | URL HTTPS pública do backend, sem barra final. É aplicada no build do Next.js. |
| `NEXT_PUBLIC_SITE_URL` | Frontend | Após domínio | URL pública do frontend. Habilita canonical, sitemap e referência do sitemap no robots. |

Não reutilize os placeholders de `.env.example` em produção e nunca versione valores reais.

## MongoDB

Configure `MONGODB_URI` com a URI fornecida pelo serviço. Os índices TTL de `lab_orders` e `lab_order_traces` continuam sendo criados pelo Spring Data e removem dados após 24 horas.

O seeder em `prod` só cria perfil, skills, experiências, projetos e administrador quando o respectivo dado ainda não existe. Reinícios e novos releases não sobrescrevem alterações feitas pelos endpoints administrativos.

## Kafka

O mesmo producer, consumer e `OrderCreatedEvent` são utilizados localmente e na cloud. O profile `prod` habilita SASL por variáveis e desabilita criação automática de tópicos para evitar exigir permissão administrativa do runtime.

Crie previamente o tópico configurado em `ORDER_CREATED_TOPIC` no serviço gerenciado. Para `PLAIN`, o login module padrão é suficiente. Em mecanismos SCRAM, configure também `KAFKA_SASL_LOGIN_MODULE` conforme a documentação do provedor.

## Health e segurança

- `GET /api/health`: disponibilidade pública leve.
- `GET /actuator/health/liveness`: processo Spring ativo.
- `GET /actuator/health/readiness`: Spring, MongoDB e Kafka prontos.
- `GET /actuator/prometheus`: exige JWT com role `ADMIN`.
- `/api/admin/**`: exige JWT com role `ADMIN`.
- Swagger e o Java Engineering Lab permanecem públicos para demonstração.
- `POST /api/lab/orders`: aproximadamente 5 execuções por minuto por IP e por instância; responde 429 ao exceder.

O backend usa forwarded headers do proxy para reconhecer HTTPS e o endereço encaminhado pelo serviço de borda. Configure o proxy do provedor para substituir, e não confiar cegamente em headers enviados pelo cliente.

## Sequência de deploy

1. Provisionar MongoDB e Kafka e criar o tópico `order-created` (ou o nome escolhido).
2. Publicar o backend com Java 21, `SPRING_PROFILES_ACTIVE=prod` e suas variáveis.
3. Confirmar readiness do backend e publicar o frontend com `NEXT_PUBLIC_API_URL`.
4. Configurar domínio, HTTPS, `NEXT_PUBLIC_SITE_URL` e `CORS_ALLOWED_ORIGINS`.
5. Executar o smoke test abaixo.

## Smoke test

Substitua `https://api.DOMINIO` apenas durante o deploy real:

```bash
curl -fsS https://api.DOMINIO/api/health
curl -fsS https://api.DOMINIO/api/profile
curl -fsS https://api.DOMINIO/api/projects
curl -fsS https://api.DOMINIO/api/lab/system-health

curl -i -X POST https://api.DOMINIO/api/lab/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Production Smoke Test","items":[{"name":"Tech World flow","quantity":1,"unitPrice":10.00}]}'
```

Use o `id` retornado para validar persistência e trace:

```bash
curl -fsS https://api.DOMINIO/api/lab/orders/ORDER_ID
curl -fsS https://api.DOMINIO/api/lab/orders/ORDER_ID/trace
```

O trace deve conter `ORDER_PERSISTED`, `EVENT_PUBLISHED`, `EVENT_CONSUMED` e `ORDER_PROCESSED`. O pedido deve terminar com status `PROCESSED`, confirmando MongoDB, producer, consumer e Kafka.
