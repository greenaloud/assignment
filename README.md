# 넥슨 백엔드 과제

### 프로젝트 구조

```
/
├── apps/
│   ├── auth/               # 마이크로서비스 A
│   ├── event/              # 마이크로서비스 B
│   ├── gateway/            # API Gateway 서비스
│   └── ...
├── libs/                   # 공유 라이브러리
└── ...
```

### 로컬 개발 환경 설정

```bash
# 전체 인프라 실행. 이후 localhost:2999 로 gateway 접근 가능
docker-compose up
```

### 접속 정보

- Gateway API: http://localhost:2999

서버 최초실행 시 권한 셋과 4명의 유저를 시드합니다.
각 유저정보는 아래와 같습니다.

```js
관리자: {
    "email": "admin@example.com",
    "password": "admin123"
},
운영자: {
    "email": "operator@example.com",
    "password": "operator123"
},
감사자: {
    "email": "auditor@example.com",
    "password": "auditor123"
},
일반유저:{
    "email": "user@example.com",
    "password": "user123"
}
```

## Gateway

### 설계 시 고민했던 부분

각 레이어간 통신 규약

```
Client - Gateway: HTTP
Gateway - 최초 Downstream Service: HTTP
Service - Service: TCP
```

Gateway 는 받은 요청을 단순히 다운스트림 서비스로 라우팅 하는 역할에만 집중할 수 있게 했습니다.

HTTP 요청을 RPC 요청으로 변환해서 다운스트림 서비스에 전달 할 수도 있지만, 이는 Gateway 가 Microservice 의 API endpoint 에 대한 지식을 가지게 되고, 하위 서비스의 API 변경이 게이트웨이의 수정을 유발할 수 있을 거라고 생각했습니다.

매 요청시 Gateway는 라우팅을 하기전에 Auth 서버에 내부적으로 사용될 ServiceToken(내부 API 에서 사용) 생성을 요청합니다.
요청 시점에 AuthToken(로그인 용도로 사용) 이 있다면 검증하고 유저정보가 포함된 ServiceToken 을 발급받습니다.

Gateway 와 최초 서비스 사이에서 HTTP 프로토콜을 사용한 이유는 아래와 같습니다.

1. Protocol 의 변화가 일어나는 경우 어쩔 수 없이 gateway 가 접근할 수 있는 정보가 많아집니다. 이는 추후 gateway 의 역할이 단순한 routing 을 벗어날 수 있는 원인이 될 것이라고 생각했습니다.
2. HTTP 프로토콜을 사용해야 하는 경우에 대비할 수 있습니다. Login 시 cookie 를 설정하거나 redirect 를 하도록 응답하는 경우에 API 를 제공하는 서비스에서 직접 수행이 가능합니다. RPC 통신을 하는경우, 이 역할을 중간에 게이트웨이가 수행해야 합니다.

Microservice 간 TCP 통신을 사용한 이유는 아래와 같습니다.

1. 별도의 인프라가 필요하지 않습니다. 서비스가 적은 경우 적절하다고 생각했습니다.
2. NestJS에서 RPC 통신의 추상화된 방법을 제공해서 추후 변경이 용이하기 때문에 기술의 선택을 추후로 미룰 수 있습니다.

### Gateway 구현

Proxy 기능을 제공하는 라이브러리 `http-proxy-middleware` 를 사용했습니다.

Middleware 로 동작하기 때문에 직접 Controller 를 정의하기 보다는 설정파일을 통해서 routing 을 하도록 구현했습니다.
아래는 설정 예시입니다.

```ts
export const eventServiceRoutes: RouteDefinition[] = [
  { path: '/events', method: 'GET', authConfig: { isPublic: true } },
  { path: '/events/:id', method: 'GET', authConfig: { isPublic: true } },
  {
    path: '/events/:id',
    method: 'PATCH',
    authConfig: {
      isPublic: false,
      requiredPermissions: [PermissionType.EVENT_WRITE],
    },
  },
  {
    path: '/events/:id',
    method: 'DELETE',
    authConfig: {
      isPublic: false,
      requiredPermissions: [PermissionType.EVENT_DELETE],
    },
  },
];
```

라우팅을 하기전에 Auth 서버에 ServiceToken 을 요청합니다. 이 때 auth service 에 필요한 권한을 같이 넘겨서 반환받는 ServiceToken 에는 요청에 필요한 최소한의 권한만 포함되도록 했습니다.

추가로 각 API endpoint 에서 Gateway 와 별개로 유효한 요청인지에 대한 토큰 검증을 합니다. 과제에서는 단순한 구현을 위해 대칭키를 사용했습니다.

### Gateway 의 확장성

새로운 서버가 추가되는 경우 작업을 최소화 하기 위한 구현을 했습니다. 새로운 서버가 추가되는 경우 해야하는 작업은 아래와 같습니다.

1. 새로운 ProxyHandler 를 추가합니다. 라이브러리 구현 상 Host 하나 당 하나의 미들웨어를 필요로 합니다. 아래는 예시입니다.

```ts
@Injectable()
export class EventServiceProxy extends ServiceProxy {
  constructor(private readonly configService: ConfigService) {
    const proxyHandler = createProxyMiddleware<Request, Response>({
      target: {
        protocol: 'http:',
        host: configService.get<string>('EVENT_SERVICE_HOST'),
        port: configService.get<number>('EVENT_SERVICE_HTTP_PORT'),
      },
      secure: false,
      on: { proxyReq: fixRequestBody },
      changeOrigin: true,
      timeout: 5000,
    });

    super(eventServiceRoutes, proxyHandler);
  }
}
```

2. 새로운 라우팅 규칙을 추가합니다. 라우팅 큐칙은 ts 코드로 작성해서 ServiceProxy 의 생성자에 전달합니다.
3. App Module 에 새로운 ProxyHandler 를 추가합니다.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    LoggerModule,
    ProxyModule.register([
      AuthServiceProxy,
      EventServiceProxy,
      // 여기에 신규 Proxy 추가
    ]),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
```

## 인증

### 인증 구조

Role 기반이지만 실제로는 Role 에 할당된 Permission 을 통해서 권한 검증을 진행합니다.

Permission 은 아래와 같은 단위로 정의했습니다.

```ts
export enum PermissionType {
  EVENT_READ = 'event:read',
  EVENT_WRITE = 'event:write',
  EVENT_DELETE = 'event:delete',
}
```

이와같이 하나의 추상화를 더 둔 이유는 아래와 같습니다.

1. Role 기반으로 하위 마이크로서비스에서 검증을 하는 경우 Role 의 세부사항을 아는 것이 불가피합니다.
2. Role 을 Permission 의 덩어리라고 생각해보면, 매 요청 시 꼭 필요하지 않은 권한을 항상 가지고 다니는 것과 같습니다.

위와같은 이유로 권한을 세분화 한 단위로 실제 API 에서도 검증하도록 구현했습니다.

Permission 을 검증하는 Guard 는 아래와 같습니다.

```ts
@Post()
@RequirePermissions(PermissionType.EVENT_WRITE)
async create(
  @Body() createEventDto: CreateEventDto,
  @CurrentUser() { id: userId }: UserInfo,
) {
  return await this.eventsService.create(createEventDto, userId);
}
```

각 서버는 각자가 정의한 Permission 이 ServiceToken 에 포함되어있는지 만을 확인합니다.

즉 위 API 에서는 ServiceToken 을 조회해서 token 에 할당된 권한목록에 `PermissionType.EVENT_WRITE` 가 포함되는지 확인합니다.
