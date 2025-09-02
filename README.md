# 🌳Hyu's Tree Board

 Hyu's Tree: Spring Boot와 React 기반 게시판형 블로그 
 ## 🌐 사이트 링크
[https://www.hyustree.store/](https://www.hyustree.store/)
## 📌 프로젝트 개요

React와 Spring Boot를 활용한 풀스택 웹 애플리케이션 개발 연습을 위한 프로젝트입니다. 

* **목표**
    * 게시판 CRUD 기능 및 사용자 상호작용(댓글, 좋아요) 구현
    * JWT 기반 인증/인가 시스템 구축
    * WebSocket을 활용한 실시간 댓글 알림 기능 구현
    * pagination 구현
        * 댓글은 프론트엔드 페이지네이션을 적용
        * 게시물은 Pageable 인터페이스를 사용해 백엔드 페이지네이션을 적용
    * vercel과 AWS를 이용하여 배포

## 🚀주요 기능

* **📂 게시물 관리**
    * 게시물 목록 조회: 최신 게시물, 주간 인기 게시물(TOP3) 목록 제공
    * 게시물 상세 조회: 게시물 내용, 작성자 정보, 이미지, 댓글, 좋아요 수 확인
    * 게시물 작성/수정/삭제: 로그인한 사용자만 게시물 작성 및 본인 게시물 수정/삭제 가능
    * 이미지 첨부: 게시물에 여러 이미지 첨부 및 미리보기 기능
 
* **💬 사용자 상호작용**
    * 댓글 기능: 게시물에 댓글 작성, 조회, 삭제 기능
    * 좋아요 기능: 게시물에 좋아요 추가/취소 기능
    * 댓글 실시간 알림: 자신의 게시글에 새로운 댓글이 작성되면 실시간으로 알림 제공
    
* **🔍 검색 기능**
    * 게시물 검색: 제목, 내용, 작성자 닉네임 등으로 게시물 검색
    * 인기 검색어: 현재 인기 있는 검색어 목록 제공
    * 관련 검색어: 특정 검색어와 관련된 추천 검색어 제공
    
* **👤 회원 기능**
    * 회원가입 및 로그인: 이메일 기반 회원가입, 구글 OAuth2 소셜 로그인, JWT를 활용한 로그인
    * 프로필 관리: 닉네임 및 프로필 이미지 수정

## 🛠️ 기술 스택

| 구분             | 기술 스택                                                      |
| :--------------- | :------------------------------------------------------------- |
| **Frontend** | React, TypeScript, Zustand, Axios, WebSocket API |
| **Backend** | Java, Spring Boot, Spring Security, **Spring WebSocket**, Spring Data JPA, MySQL |
| **Authentication** | **JWT (JSON Web Token)**, OAuth2.0 |
| **Infra** | **AWS** (EC2, VPC, RDS, Route53, ACM, Load Balancer), Vercel |
| **Tools** | Git, GitHub, VS Code |

## 🌎 배포 환경
* Frontend: Vercel
* Backend: AWS EC2 (Spring Boot) + AWS RDS(MySQL)
* 도메인 관리: AWS Route53 + 가비아

## ⚠️ 배포 과정 문제 해결

### 1. Vercel 빌드 오류 (TS2307: Cannot find module)
* **원인:** 여러 파일 중 특정 파일에서만 `response.dto` 경로를 찾지 못해 발생
* **해결 방법:**
  - 절대 경로를 상대 경로로 변경
  - import 경로에 `.ts` 확장자 명시

### 2. Mixed Content 오류
* **원인:** HTTPS(Vercel)에서 접속한 프론트엔드가 HTTP(EC2) API 요청 → 브라우저 차단
* **해결 방법:**
  1. 가비아에서 도메인 구매 후 AWS Route53에서 관리
  2. AWS Certificate Manager에서 SSL/TLS 인증서 발급
  3. EC2 서버를 HTTPS로 전환 → 프론트/백엔드 모두 HTTPS 통일
 

 ### 3.  로드 밸런서 상태 검사 오류
* **원인**
   * net::ERR_CONNECTION_CLOSED 오류가 발생
   * 로드 밸런서가 401 (Unauthorized) 에러를 반환하는 엔드포인트에 헬스 체크를 시도하여 대상 인스턴스가 비정상 상태로 판단되어 오류 발생
* **해결 방법:**
  1. 로드 밸런서의 상태 검사 경로를 로그인 없이 접근 가능한 엔드포인트로 변경하여 해결


## 🎥 시연 영상

![Hyu's Tree짧](https://github.com/user-attachments/assets/76bf3198-2cc6-462f-9fcf-ed5f3d426e8e)

[좀 더 긴 영상 YouTube](https://youtu.be/t1HfXaZwrUg)
