# Use Maven for building
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy everything and build the project
COPY . .
RUN mvn clean package -DskipTests

# Use a smaller JDK runtime for production
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Run Spring Boot with Maven
CMD ["java", "-jar", "app.jar"]

# Expose port 8080
EXPOSE 8080

