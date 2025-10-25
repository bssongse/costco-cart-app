# Netlify 배포 가이드

## 완료된 작업

### 1. Netlify 설정 파일 생성
`netlify.toml` 파일을 프로젝트 루트에 생성했습니다.

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Git 저장소 설정
- Git 저장소 초기화 완료
- netlify.toml 파일 커밋 완료
- GitHub 저장소에 푸시 완료
  - 저장소: https://github.com/bssongse/costco-cart-app.git
  - 브랜치: master

### 3. Netlify CLI 설치
Netlify CLI가 설치되었습니다.

```bash
npm install -g netlify-cli
```

## 다음 단계

### 4. Netlify에 로그인 및 배포

```bash
# Netlify 로그인
netlify login

# 사이트 초기화 및 배포
netlify init

# 또는 직접 배포
netlify deploy --prod
```

### 5. 환경 변수 설정

Netlify 대시보드에서 다음 환경 변수를 설정해야 합니다:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

#### 환경 변수 설정 방법

**옵션 1: Netlify CLI 사용**
```bash
netlify env:set VITE_FIREBASE_API_KEY "your_api_key"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "your_auth_domain"
# ... 나머지 변수들도 동일하게 설정
```

**옵션 2: Netlify 대시보드 사용**
1. https://app.netlify.com 접속
2. 사이트 선택
3. Site settings > Environment variables
4. Add a variable 클릭하여 각 변수 추가

### 6. 자동 배포 설정

GitHub 저장소와 Netlify가 연동되면, master 브랜치에 푸시할 때마다 자동으로 배포됩니다.

## 배포 확인

배포가 완료되면 Netlify가 제공하는 URL로 접속하여 앱이 정상 작동하는지 확인하세요.

```bash
# 배포 상태 확인
netlify status

# 사이트 열기
netlify open:site
```

## 문제 해결

### 빌드 실패
- 환경 변수가 제대로 설정되었는지 확인
- 로컬에서 `npm run build`가 성공하는지 확인

### 라우팅 문제
- `netlify.toml`의 리다이렉트 설정 확인
- SPA 설정이 제대로 되어 있는지 확인

## 참고 자료

- [Netlify 문서](https://docs.netlify.com/)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [Firebase 설정](https://firebase.google.com/docs/web/setup)
