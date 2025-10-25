# Firebase Hosting 배포 가이드

## 준비 완료!

Firebase 설정 파일들이 자동으로 생성되었습니다:
- ✅ `firebase.json` - Firebase Hosting 설정
- ✅ `.firebaserc` - 프로젝트 연결 (costco-df701)
- ✅ `firestore.rules` - Firestore 보안 규칙
- ✅ `firestore.indexes.json` - Firestore 인덱스

---

## 배포 단계

### 1단계: Firebase 로그인

**새 터미널 창**을 열고 다음 명령어를 실행하세요:

```bash
firebase login
```

- 브라우저가 자동으로 열립니다
- Google 계정으로 로그인
- 권한 허용
- 터미널로 돌아오면 "Success!" 메시지 확인

---

### 2단계: 프로덕션 빌드 생성

프로젝트 폴더로 이동하여 빌드합니다:

```bash
cd costco-cart
npm run build
```

- `dist` 폴더가 생성됩니다
- 최적화된 프로덕션 코드가 포함됩니다

---

### 3단계: Firebase에 배포

```bash
firebase deploy
```

이 명령어는:
- ✅ Firestore 보안 규칙 업데이트
- ✅ 웹사이트를 Firebase Hosting에 배포

배포가 완료되면 다음과 같은 URL이 표시됩니다:
```
Hosting URL: https://costco-df701.web.app
```

---

## 빠른 배포 (한 번에)

로그인 후 다음 명령어들을 순서대로 실행:

```bash
cd costco-cart
npm run build
firebase deploy
```

---

## 배포 후 확인 사항

### 1. 웹사이트 접속
- https://costco-df701.web.app 접속
- 또는 https://costco-df701.firebaseapp.com 접속

### 2. 기능 테스트
- ✅ 장바구니 생성
- ✅ 상품 추가/삭제
- ✅ 링크 공유
- ✅ 실시간 동기화

### 3. Firebase Console 확인
- [Firebase Console](https://console.firebase.google.com/)
- Hosting 탭에서 배포 내역 확인
- Firestore에서 데이터 확인
- Authentication에서 익명 사용자 확인

---

## 업데이트 배포

코드를 수정한 후 다시 배포:

```bash
npm run build
firebase deploy
```

---

## 커스텀 도메인 설정 (선택사항)

1. Firebase Console > Hosting
2. "도메인 추가" 클릭
3. 도메인 이름 입력
4. DNS 설정 지침 따르기

---

## 문제 해결

### 로그인 실패
```bash
firebase logout
firebase login --reauth
```

### 배포 실패
```bash
# 프로젝트 확인
firebase projects:list

# 프로젝트 선택
firebase use costco-df701

# 다시 배포
firebase deploy
```

### 빌드 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install

# 다시 빌드
npm run build
```

---

## 배포 명령어 요약

```bash
# 로그인 (최초 1회)
firebase login

# 배포 (코드 변경 시마다)
cd costco-cart
npm run build
firebase deploy
```

완료! 🎉
