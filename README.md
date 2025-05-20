# 넥슨 백엔드 과제

이 프로젝트는 NestJS를 기반으로 한 마이크로서비스 아키텍처의 모노레포입니다. API Gateway를 통해 여러 마이크로서비스와 통신하는 구조를 가지고 있습니다.

## 프로젝트 구조

```
/
├── apps/
│   ├── auth/               # 마이크로서비스 A
│   ├── event/              # 마이크로서비스 B
│   ├── gateway/            # API Gateway 서비스
│   └── ...
├── libs/                   # 공유 라이브러리
├── docker-compose.yml      # Docker Compose 설정
└── ...
```

## 기술 스택

- NestJS - 백엔드 프레임워크
- TypeScript - 프로그래밍 언어
- Docker - 컨테이너화
- Docker Compose - 다중 컨테이너 애플리케이션 관리
- [추가 기술 스택]

## 로컬 개발 환경 설정

### 필수 조건

- Docker
- Docker Compose
- Git

### 실행 방법

1. 저장소 클론:

```bash
git clone git@github.com:greenaloud/assignment.git
cd assignment
```

2. 도커 컴포즈로 실행:

```bash
docker-compose up
```

이 명령은 모든 마이크로서비스 및 게이트웨이를 빌드하고 실행합니다. 각 서비스는 독립적인 컨테이너에서 실행되며, 게이트웨이를 통해 통신합니다.

### 접속 정보

- Gateway API: http://localhost:2999
- 서비스 A: http://localhost:3001 (컨테이너 내부에서만 접근 가능)
- 서비스 B: http://localhost:3002 (컨테이너 내부에서만 접근 가능)
- [추가 서비스 접속 정보]

## 환경 변수

필요한 환경 변수는 `.env` 파일에 정의할 수 있습니다. 예시 파일 `.env.example`을 참고하여 설정하세요.
