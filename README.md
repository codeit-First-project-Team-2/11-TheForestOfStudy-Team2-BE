# 🌳 공부의 숲 (The Forest of Study) - FE

이 레포지토리는 **공부의 숲** 프로젝트의 프론트엔드 저장소입니다.  



### 실행하기

```bash
git clone https://github.com/codeit-First-project-Team-2/11-TheForestOfStudy-Team2-BE.git

# 폴더 이동
cd 11-TheForestOfStudy-Team2-BE

npm install

# 로컬 개발 서버 실행
# 1. 의존성 설치
npm install

# 2. 환경 변수 파일 생성 (반드시 3번 항목 확인 후 수정!)
cp env/.env.example env/.env.development

# 3. 로컬 개발 서버 실행 (nodemon)
npm run dev

```

## 🛠 기술 스택
  <div align=center>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=%2361DAFB"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white"/>
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white"/>
    <img src="https://img.shields.io/badge/Render-%46E3B7.svg?style=flat-square&logo=render&logoColor=white" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white"/>
<img src="https://img.shields.io/badge/github-181717?style=flat-square&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=flat-square&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/figma-e05a32?style=flat-square&logo=figma&logoColor=white">
   
</div>

## 📂 폴더 구조 (src/)

```text
src/
├── config/         # Prisma 인스턴스 및 환경 변수(Zod) 설정
├── constants/      # 상수 정의
├── exceptions/     # 전역 에러 핸들링 및 예외 처리 로직
├── repositories/   # DB 직접 접근 로직 (Prisma Query)
├── routes/         # API 엔드포인트 경로 정의
├── middlewares/    # 인증, 에러 핸들링, 유효성 검사 미들웨어
├── errors/         # 커스텀 에러 클래스 정의
├── utils/          # 공통 유틸리티 함수 (날짜, 암호화 등)
├── server.js       # Express 앱 설정 및 미들웨어 연결

```
<div align ="center">
  
| 팀원 Github | 팀원 Github | 팀원 Github |
| :---------: | :---------: | :---------: |
| [<img src="https://avatars.githubusercontent.com/u/79955539?v=4" width="200" alt="안예진">](https://github.com/yyejin00) | [<img src="https://avatars.githubusercontent.com/u/244665250?v=4" width="200" alt="김민성">](https://github.com/alstjddl0513-sys) | [<img src="https://avatars.githubusercontent.com/u/244856097?v=4" width="200" alt="오동철">](https://github.com/odc0202) |
| 안예진 | 김민성 | 오동철 |
| [<img src="https://avatars.githubusercontent.com/u/33364524?v=4" width="200" alt="강에스더">](https://github.com/lareina7486) | [<img src="https://avatars.githubusercontent.com/u/243271260?v=4" width="200" alt="김은혜">](https://github.com/kimgreen-xoxo) | |
| 강에스더 | 김은혜 |  |
  
</div>
<!--
1. 각자맡은 기능 상세하게 작성
2. 화면캡쳐
-->
## ✒프로젝트 회의록  
(https://cake-locust-27b.notion.site/2-2ee5da27db9e8083bc59c6cc61e14b95)
 👈 클릭해서 회의록 보기




