# application.properties 설정

## 애플리케이션 이름

spring.application.name=board-back

## 파일 업로드 설정

spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=30MB

## JWT 비밀키 (배포 환경에 맞는 비밀키를 설정해주세요)

secret-key=YOUR_DEPLOY_SECRET_KEY

## 데이터베이스 설정

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/[데이터베이스명]?serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=[유저명]
spring.datasource.password=[패스워드]

## JPA 및 Hibernate 설정

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

## CORS 설정 (프런트엔드 배포 주소)

cors.allowed-origins=[https://www.hyustree.store/]

## 파일 경로 및 URL

file.path=/home/ubuntu/[저장할 폴더 경로]
file.url=[https://[백엔드 API 서버 주소]/file/]

## Google OAuth2 설정

spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=email,profile
spring.security.oauth2.client.registration.google.redirect-uri=[https://[백엔드 API 서버 주소]/login/oauth2/code/google]

spring.security.oauth2.client.provider.google.authorization-uri=[https://accounts.google.com/o/oauth2/auth]
spring.security.oauth2.client.provider.google.token-uri=[https://oauth2.googleapis.com/token]
spring.security.oauth2.client.provider.google.user-info-uri=[https://www.googleapis.com/oauth2/v2/userinfo]
spring.security.oauth2.client.provider.google.user-name-attribute=id

### 프론트 .env 설정

REACT_APP_API_BASE_URL=[백엔드 API 서버 주소]
