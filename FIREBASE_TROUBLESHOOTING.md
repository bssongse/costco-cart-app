# Firebase 아이템 추가 문제 해결 가이드

## 문제 증상
앱에서 아이템을 추가하려고 할 때 "아이템 추가에 실패했습니다" 메시지가 표시됩니다.

## 해결 방법

### 1단계: 브라우저 콘솔 확인

1. 앱을 열고 F12를 눌러 개발자 도구를 엽니다
2. Console 탭을 클릭합니다
3. 다음 로그를 확인합니다:
   - "Firebase 설정 확인" - 모든 값이 "설정됨" 또는 실제 값이 표시되어야 합니다
   - 아이템 추가 시도 시 에러 메시지를 확인합니다

### 2단계: Firebase Authentication 설정 확인

**가장 흔한 원인: 익명 로그인이 비활성화되어 있음**

1. Firebase Console 접속: https://console.firebase.google.com/
2. 프로젝트 선택: `costco-df701`
3. 왼쪽 메뉴에서 **Authentication** 클릭
4. **Sign-in method** 탭 클릭
5. **익명(Anonymous)** 찾기
6. 익명 로그인이 **사용 중지됨**으로 되어 있다면:
   - 익명 행을 클릭
   - **사용 설정** 토글을 ON으로 변경
   - **저장** 클릭

### 3단계: Firestore 보안 규칙 확인

1. Firebase Console에서 **Firestore Database** 클릭
2. **규칙(Rules)** 탭 클릭
3. 다음과 같은 규칙이 있는지 확인:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carts/{cartId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;

      match /items/{itemId} {
        allow read: if true;
        allow create, update, delete: if request.auth != null;
      }
    }
  }
}
```

4. 규칙이 다르다면:
   - 위 내용을 복사하여 붙여넣기
   - **게시** 버튼 클릭

또는 명령줄에서:
```bash
cd costco-cart
firebase deploy --only firestore:rules
```

### 4단계: 환경 변수 확인

#### 로컬 개발 환경

1. `costco-cart/.env` 파일이 존재하는지 확인
2. 파일에 다음 값들이 모두 있는지 확인:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. 개발 서버 재시작:
```bash
npm run dev
```

#### Netlify 배포 환경

1. https://app.netlify.com 접속
2. 사이트 선택
3. **Site settings** > **Environment variables** 클릭
4. 다음 변수들이 설정되어 있는지 확인:
   - `VITE_FIREBASE_API_KEY`: AIzaSyCimk8tXOfBZtKOwe5qKXbuvcQpOOJtFuQ
   - `VITE_FIREBASE_AUTH_DOMAIN`: costco-df701.firebaseapp.com
   - `VITE_FIREBASE_PROJECT_ID`: costco-df701
   - `VITE_FIREBASE_STORAGE_BUCKET`: costco-df701.firebasestorage.app
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: 133851906421
   - `VITE_FIREBASE_APP_ID`: 1:133851906421:web:37889526a5a8e924e8d33c

5. 변수를 추가하거나 수정한 경우 사이트 재배포:
   - **Deploys** 탭으로 이동
   - **Trigger deploy** > **Deploy site** 클릭

또는 CLI 사용:
```bash
cd costco-cart
set-netlify-env.bat
netlify deploy --prod
```

### 5단계: 네트워크 연결 확인

1. 인터넷 연결 상태 확인
2. 방화벽이 Firebase 도메인을 차단하지 않는지 확인:
   - firebaseapp.com
   - googleapis.com
   - firebaseio.com

## 에러 메시지별 해결 방법

### "권한이 없습니다. Firebase 설정을 확인해주세요."
- **원인**: Firestore 보안 규칙 문제 또는 인증 실패
- **해결**: 2단계와 3단계 진행

### "네트워크 연결을 확인해주세요."
- **원인**: 인터넷 연결 문제 또는 Firebase 서버 접근 불가
- **해결**: 5단계 진행

### "사용자 인증 중입니다. 잠시 후 다시 시도해주세요."
- **원인**: 익명 로그인이 완료되지 않음
- **해결**: 2단계 진행 (익명 로그인 활성화)

### "장바구니를 초기화하는 중입니다. 잠시 후 다시 시도해주세요."
- **원인**: cartId가 생성되지 않음
- **해결**: 페이지 새로고침

## 테스트

모든 설정을 완료한 후:

1. 브라우저에서 앱을 새로고침 (Ctrl+Shift+R)
2. 개발자 도구 콘솔 확인:
   - "Firebase 설정 확인" 로그에서 모든 값이 설정되었는지 확인
   - 에러 메시지가 없는지 확인
3. 아이템 추가 시도
4. 콘솔에 "아이템 추가 성공" 메시지가 표시되는지 확인

## 추가 도움

문제가 계속되면 브라우저 콘솔의 전체 에러 메시지를 확인하세요. 에러 메시지에는 정확한 문제 원인이 포함되어 있습니다.
