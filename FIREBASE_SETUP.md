# Firebase 설정 가이드

## 1. Firestore Database 생성

### 단계별 안내:

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. `costco-df701` 프로젝트 선택
3. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
4. **"데이터베이스 만들기"** 버튼 클릭

### 설정 옵션:

**1단계: 보안 규칙 선택**
- ⚠️ **"테스트 모드에서 시작"** 선택
- (나중에 보안 규칙을 업데이트할 예정입니다)

**2단계: 위치 선택**
- **asia-northeast3 (Seoul)** 선택 (권장)
- 또는 가장 가까운 지역 선택

**3단계: 완료**
- "사용 설정" 버튼 클릭
- 데이터베이스 생성까지 1-2분 소요

---

## 2. Authentication (익명 인증) 활성화

### 단계별 안내:

1. Firebase Console에서 왼쪽 메뉴의 **"Authentication"** 클릭
2. **"시작하기"** 버튼 클릭 (처음이라면)
3. **"Sign-in method"** 탭 클릭
4. **"익명"** 항목 찾기
5. 익명 항목 클릭 → **"사용 설정"** 토글 ON
6. **"저장"** 버튼 클릭

---

## 3. Firestore 보안 규칙 설정

### 설정 방법:

1. Firestore Database 페이지로 돌아가기
2. 상단의 **"규칙"** 탭 클릭
3. 아래 규칙을 복사하여 붙여넣기:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 장바구니 컬렉션
    match /carts/{cartId} {
      // 누구나 읽을 수 있음
      allow read: if true;

      // 인증된 사용자만 생성/수정 가능
      allow create: if request.auth != null;
      allow update: if request.auth != null;

      // 하위 아이템 컬렉션
      match /items/{itemId} {
        // 누구나 읽을 수 있음
        allow read: if true;

        // 인증된 사용자만 생성/수정/삭제 가능
        allow create, update, delete: if request.auth != null;
      }
    }

    // 사용자 프로필 컬렉션
    match /users/{userId} {
      // 본인만 읽고 쓸 수 있음
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

4. **"게시"** 버튼 클릭

---

## 4. 설정 완료 확인

### 확인 사항:

✅ Firestore Database가 생성되었습니다
✅ Authentication > Sign-in method에서 "익명" 활성화
✅ Firestore 보안 규칙 업데이트 완료

---

## 보안 규칙 설명

### 장바구니 (carts):
- **읽기**: 누구나 가능 (링크만 있으면 접근)
- **쓰기**: 인증된 사용자만 가능 (익명 포함)

### 아이템 (items):
- **읽기**: 누구나 가능
- **쓰기/삭제**: 인증된 사용자만 가능

### 사용자 프로필:
- **읽기/쓰기**: 본인만 가능

이렇게 하면 링크를 받은 사람은 누구나 장바구니를 볼 수 있지만, 수정하려면 앱을 열어서 자동으로 익명 인증을 받아야 합니다.

---

## 다음 단계

Firebase Console 설정이 완료되면 앱 코드가 자동으로 익명 인증을 처리합니다.

브라우저를 새로고침하면 자동으로 익명 사용자로 로그인됩니다!
