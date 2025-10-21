# # Multi-stage Dockerfile for a Spring Boot app (Maven) using MongoDB
# # Build stage
# FROM maven:3.8.8-openjdk-17-slim AS build
# WORKDIR /workspace/app

# # copy only what is needed to leverage Docker layer caching
# COPY pom.xml mvnw ./
# COPY .mvn .mvn
# RUN chmod +x ./mvnw || true
# RUN mvn -B dependency:go-offline

# # copy source and build
# COPY src ./src
# RUN mvn -B -DskipTests package

# # Runtime stage
# FROM eclipse-temurin:17-jre-jammy
# ARG JAR_FILE=/workspace/app/target/*.jar
# COPY --from=build ${JAR_FILE} /app.jar

# # non-root user
# RUN addgroup --system spring && adduser --system --ingroup spring spring
# USER spring:spring

# ENV JAVA_OPTS="-Xms256m -Xmx512m"
# # If you want a default mongo URI for local compose setups, uncomment and adjust:
# # ENV SPRING_DATA_MONGODB_URI="mongodb://mongo:27017/pdl"

# EXPOSE 8080

# ENTRYPOINT ["sh","-c","java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /app.jar"]


# build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

# run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
