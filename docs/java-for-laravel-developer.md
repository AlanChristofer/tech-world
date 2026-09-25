# Java for a Laravel Developer

Mapa curto dos conceitos que aparecem **neste projeto**.

## Java Engineering Lab

Estas relações ajudam a navegar pelo laboratório, mas são apenas aproximações didáticas:

| Spring / Java | Aproximação no Laravel |
|---|---|
| Spring Controller | Laravel Controller |
| Bean Validation | Form Request Validation |
| Use Case | Application Service / Service |
| Port | Interface / Contract |
| Adapter | Infrastructure Implementation |
| MongoRepository | Repository / persistência de Model |
| Spring Security | Middleware / Auth |
| Kafka Consumer | Queue Listener / Job Consumer |

No fluxo de pedidos, `OrderLabController` recebe o contrato HTTP, `OrderLabService` coordena a operação por portas e os adapters implementam MongoDB e Kafka. O domínio não conhece framework, banco ou transporte.

| Laravel / PHP | Spring Boot / Java neste projeto |
|---|---|
| Controller | `@RestController`; traduz HTTP e delega ao caso de uso |
| Service | Classes em `application/usecase`; concentram orquestração e regras |
| Service Container / DI | Spring IoC compõe dependências via construtor em `ApplicationConfig` |
| Route | `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping` |
| Form Request validation | Records de request com Bean Validation (`@NotBlank`, `@Size`, `@NotNull`) |
| Eloquent model | Entidade de domínio + `MongoRepository`; são separados para o domínio não conhecer MongoDB |
| Repository contract | Output port (interface) implementada por um adapter de persistência |
| Middleware / Guard | `SecurityFilterChain` e Resource Server JWT |
| Hash facade | `PasswordEncoder` com BCrypt atrás de `PasswordHashPort` |
| Exception Handler | `@RestControllerAdvice` padroniza status e corpo de erro |
| API Resource / DTO | Java `record`, adequado para contratos imutáveis |
| `.env` + config | `application.yml` lê environment variables com valores locais seguros |
| Artisan seeder | `ApplicationRunner`, com verificações para nunca sobrescrever dados |
| Composer | Maven (`pom.xml` e Maven Wrapper) |
| PHPUnit / Mockery | JUnit 5 / Mockito; Testcontainers fornece MongoDB real na integração |

## Diferenças úteis

- Interfaces de porta existem para inverter a dependência: o caso de uso conhece o contrato, enquanto MongoDB implementa esse contrato.
- Records dão imutabilidade concisa a modelos e DTOs. Alterações geram uma nova instância em vez de setters.
- `Optional` comunica uma busca que pode não encontrar resultado; o caso de uso converte a ausência em exceção de domínio.
- Annotations configuram bordas do sistema, mas o package `domain` permanece Java puro e testável sem iniciar Spring.
