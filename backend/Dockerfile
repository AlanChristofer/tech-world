FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn .mvn
RUN mvn -B -DskipTests dependency:go-offline
COPY src src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl && addgroup -S spring && adduser -S spring -G spring
USER spring:spring
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 CMD curl -fsS http://localhost:8080/api/health || exit 1
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
