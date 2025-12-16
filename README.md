# App-Simple-Store (React Native / Expo)

## 실행 방법

### 1) 백엔드 실행

별도 터미널에서:

```bash
cd ../Nodejs-Simple-Store
npm install
npm start
```

기본 API: `http://localhost:3000/api`

### 2) 앱 실행

```bash
npm install
npm start
```

## Optimizely Feature Experimentation 설정

이 앱은 `@optimizely/react-sdk`를 사용하며, SDK Key는 Expo public env로 주입합니다.

```bash
EXPO_PUBLIC_OPTIMIZELY_SDK_KEY=<YOUR_OPTIMIZELY_SDK_KEY> npm start
```

참고: 현재 앱은 "로그인 후 이용" 플로우로 구성되어 있으며, Optimizely `user.id`는 로그인 사용자 정보를 기반으로 생성됩니다.

## API Base URL 설정(중요)

모바일에서 `localhost`는 기기 자신을 의미할 수 있습니다.

- iOS Simulator: 기본값 `http://localhost:3000/api` 사용 가능
- Android Emulator: 기본값 `http://10.0.2.2:3000/api` 사용
- 실기기(Expo Go): 아래처럼 Mac의 LAN IP로 지정 필요

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:3000/api npm start
```
