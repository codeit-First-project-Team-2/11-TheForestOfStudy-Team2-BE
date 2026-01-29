# 🌳 공부의 숲 (The Forest of Study) - BE

이 레포지토리는 **공부의 숲** 프로젝트의 백엔드 저장소입니다.  
일관된 협업을 위해 아래의 가이드를 반드시 준수해 주세요.

---

## 🚀 시작하기

### 1. 프로젝트 불러오기

```bash
# 레포지토리 클론
git clone https://github.com/codeit-First-project-Team-2/11-TheForestOfStudy-Team2-BE.git

# 폴더 이동
cd 11-TheForestOfStudy-Team2-BE

# 내 작업 브랜치 생성 및 이동
git switch -c feature/<기능명>
```

### 2. 패키지 설치 및 환경 설정

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 파일 생성 (반드시 3번 항목 확인 후 수정!)
cp env/.env.example env/.env.development

# 3. 로컬 개발 서버 실행 (nodemon)
npm run dev
```

### 3. 환경 변수 및 DB 설정 (⚠️ 필수)

- 파일 수정: `env/.env.development` 내의 `DATABASE_URL`을 본인 로컬 Postgres 계정에 맞게 수정하세요.
- DB 마이그레이션: 파일 수정 후 아래 명령어를 실행하여 테이블을 생성합니다.

```bash
npm run prisma:migrate
```

### 4. pull / push (⚠️ Git 충돌 방지 규칙)

```bash
# 아래 과정 반복
pull -> coding -> commit -> push -> (PR)

# 작업 시작할때
git checkout develop
git pull origin develop

# pull 할때는 부모 브랜치(develop) 기준으로!
git checkout feature/...
git pull origin develop
```

**!!! 반드시 pull 해야 하는 타이밍?**

- **작업 시작하기 직전**
- **브랜치 전환 직후**
- **어제 작업하고 오늘 다시 시작할 때**
- **PR 머지된 뒤**

---

## 💡 만약 로컬에서 코드를 먼저 작성했다면?

이미 작업 중인 폴더가 있는 경우, 아래 순서대로 진행하여 연결하세요.

1. **초기화:** `git init`
2. **체크:** `.gitignore` 파일이 있는지 반드시 확인 (없으면 생성)
3. **커밋:** `git add .` -> `git commit -m "init: 프로젝트 초기 세팅"`
4. **연결:** `git remote add origin https://github.com/codeit-First-project-Team-2/11-TheForestOfStudy-Team2-BE.git`
5. **푸시:** `git push -u origin <브랜치명>`

---

## 🛠 기술 스택

- **Framework**: Express
- **Database**: PostreSQL
- **ORM**: Prisma ORM
- **Language**: JavaScript (ES Modules)
- **Validation**: Zod
- **ID Generation**: ULID
- **Linting**: ESLint, Prettier

---

## 📂 BE 폴더 구조 (src/)

```text
src/
├── config/         # Prisma 인스턴스 및 환경 변수(Zod) 설정
├── controllers/    # HTTP 요청 처리 및 응답 반환 (Req/Res)
├── services/       # 핵심 비즈니스 로직
├── repositories/   # DB 직접 접근 로직 (Prisma Query)
├── routes/         # API 엔드포인트 경로 정의
├── middlewares/    # 인증, 에러 핸들링, 유효성 검사 미들웨어
├── errors/         # 커스텀 에러 클래스 정의
├── utils/          # 공통 유틸리티 함수 (날짜, 암호화 등)
├── app.js          # Express 앱 설정 및 미들웨어 연결
└── index.js        # 서버 실행 엔트리 포인트
```

---

## 📝 데이터베이스 관리 (Prisma)

데이터베이스 스키마 수정 시 아래 명령어를 통해 동기화합니다.

```bash
# 스키마 변경 사항을 실제 DB에 반영
npm run prisma:migrate

# GUI 환경에서 실시간 데이터 확인
npm run prisma:studio
```

---

## 📝 커밋 메시지 컨벤션

**FE와 동일하게 메세지는 영어가 아닌 한글로 적어주세요!**

- **feat** : 새로운 기능 추가
- **fix** : 버그 수정
- **docs** : 문서 추가, 수정, 삭제 (README 등)
- **refactor** : 코드 리팩토링 (기능 변화 X)
- **style** : 코드 형식 변경 (세미콜론 등, 기능 변화 X)
- **chore** : 빌드 설정, 패키지 매니저 수정
- **db** : Prisma 스키마 변경 및 DB 마이그레이션 작업
- **init** : 프로젝트 초기 세팅
- **rename** : 파일/폴더명 수정 또는 이동
- **remove** : 파일 삭제

---

## 🌿 브랜치 전략

- **main**: 최종 배포용 최상위 브랜치
- **develop**: 개발의 중심이 되는 브랜치
- **feature/<기능명>**: 기능 단위 브랜치 (완료 후 develop에 merge)

---

## 💻 팀원별 구현 기능 상세 (Backend)

| 팀원       | 담당 API 및 기능 |
| ---------- | ---------------- |
| **팀원명** | 추가될 기능 내용 |

<br>
<br>
<br>
<br>
