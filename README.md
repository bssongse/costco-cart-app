# 코스트코 장바구니 앱

로그인 없이 링크만으로 장바구니를 공유하고 여러 사람이 함께 수정할 수 있는 웹 앱입니다.

## 주요 기능

- 상품 추가/삭제/수정
- 수량 조절
- 체크박스로 구매 완료 표시
- 링크 공유 (로그인 불필요)
- 실시간 동기화 (여러 사람이 동시 수정 가능)

## Firebase 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: costco-cart)
4. Google Analytics는 선택사항

### 2. Firestore Database 생성

1. Firebase 프로젝트 대시보드에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작 (나중에 규칙 수정 가능)
4. 위치 선택 (asia-northeast3 - 서울 권장)

### 3. 보안 규칙 설정

Firestore Database > 규칙 탭에서 다음 규칙을 설정하세요:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carts/{cartId} {
      allow read, write: if true;
      match /items/{itemId} {
        allow read, write: if true;
      }
    }
  }
}
\`\`\`

### 4. 웹 앱 설정

1. Firebase 프로젝트 설정 (톱니바퀴 아이콘) 클릭
2. "내 앱"에서 웹 앱 추가 (</> 아이콘)
3. 앱 닉네임 입력
4. Firebase SDK 구성 정보 복사

### 5. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Firebase 설정 값을 입력하세요:

\`\`\`bash
cp .env.example .env
\`\`\`

`.env` 파일을 열고 Firebase Console에서 복사한 값으로 채우세요:

\`\`\`
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

## 설치 및 실행

\`\`\`bash
# 프로젝트 디렉토리로 이동
cd costco-cart

# 의존성 설치 (이미 완료됨)
npm install

# 개발 서버 실행
npm run dev
\`\`\`

## 사용 방법

1. 앱을 실행하면 자동으로 새 장바구니가 생성됩니다
2. 상품명과 수량을 입력하고 "추가" 버튼을 클릭
3. 상품명을 더블클릭하여 수정 가능
4. +/- 버튼으로 수량 조절
5. 체크박스로 구매 완료 표시
6. "링크 복사" 버튼으로 다른 사람과 공유
7. 같은 링크를 열면 실시간으로 동기화됩니다

## 기술 스택

- React 18
- Vite
- Firebase Firestore
- 순수 CSS

## 라이선스

MIT
