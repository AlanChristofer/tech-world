FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn .mvn
RUN mvn -B -DskipTests dependency:go-offline
COPY src src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl \
    && addgroup -S spring \
    && adduser -S spring -G spring \
    && secrets_group="$(awk -F: '$3 == 1000 { print $1; exit }' /etc/group)" \
    && if [ -z "$secrets_group" ]; then addgroup -S -g 1000 render-secrets; secrets_group=render-secrets; fi \
    && addgroup spring "$secrets_group"
USER spring:spring
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 CMD port="${SERVER_PORT:-${PORT:-8080}}"; curl -fsS "http://localhost:${port}/actuator/health/readiness" || exit 1
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
