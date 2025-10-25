# Cursor에서 GitHub로 올리기

## 방법 1: Cursor의 Source Control 사용 (가장 쉬움)

### 1단계: Source Control 열기
- 왼쪽 사이드바에서 **Source Control** 아이콘 클릭 (브랜치 모양 아이콘)
- 또는 단축키: `Ctrl + Shift + G`

### 2단계: Publish to GitHub
1. Source Control 패널에서 **"Publish to GitHub"** 버튼 클릭
2. GitHub 로그인 요청 시 → **"Allow"** 클릭
3. 브라우저가 열리면 → GitHub 계정으로 로그인
4. "Authorize GitHub" 클릭하여 Cursor에 권한 부여

### 3단계: 저장소 설정
1. 저장소 이름 입력: `costco-cart`
2. Public/Private 선택
3. **"Publish Repository"** 클릭

완료! 🎉 자동으로 GitHub에 업로드됩니다.

---

## 방법 2: Cursor 터미널 사용

### 1단계: GitHub에서 저장소 생성
1. [GitHub.com](https://github.com) 접속
2. 우측 상단 **+** → **New repository**
3. 저장소 이름: `costco-cart`
4. **Create repository** 클릭
5. 생성된 저장소 URL 복사 (예: `https://github.com/username/costco-cart.git`)

### 2단계: Cursor 터미널에서 연결
Cursor에서 터미널 열기: `Ctrl + ~`

```bash
# 원격 저장소 추가
git remote add origin https://github.com/username/costco-cart.git

# 브랜치 이름을 main으로 변경 (선택사항)
git branch -M main

# GitHub에 push
git push -u origin main
```

완료! 🎉

---

## 방법 3: GitHub Desktop 사용

### 1단계: GitHub Desktop 설치
- https://desktop.github.com/ 에서 다운로드 및 설치

### 2단계: 저장소 추가
1. GitHub Desktop 실행
2. **File** → **Add Local Repository**
3. 프로젝트 폴더 선택: `C:\Users\SONG\Desktop\GHAS_App\costco-cart`
4. **Add Repository** 클릭

### 3단계: Publish
1. 상단의 **"Publish repository"** 버튼 클릭
2. 저장소 이름 확인: `costco-cart`
3. Public/Private 선택
4. **Publish Repository** 클릭

완료! 🎉

---

## 이미 커밋이 완료되었습니다!

현재 상태:
```
✅ Git 저장소 초기화 완료
✅ 모든 파일 커밋 완료 (23 files, 5408 lines)
✅ 커밋 메시지: "Initial commit: Add Costco shopping cart app with Firebase"
```

이제 위 방법 중 하나를 선택해서 GitHub에 올리기만 하면 됩니다!

---

## 추천 방법

**Cursor의 Source Control 사용** (방법 1)
- 가장 간단하고 빠름
- GUI로 쉽게 관리
- 클릭 몇 번으로 완료

---

## 이후 업데이트 방법

코드를 수정한 후:

### Cursor Source Control에서:
1. 변경된 파일 확인
2. 커밋 메시지 입력
3. **Commit** 버튼 클릭
4. **Sync Changes** 버튼 클릭 (자동 push)

### 터미널에서:
```bash
git add .
git commit -m "Update: 설명"
git push
```

---

## 문제 해결

### "remote origin already exists" 오류
```bash
git remote remove origin
git remote add origin https://github.com/username/costco-cart.git
```

### 인증 실패
```bash
# GitHub Personal Access Token 사용
# Settings → Developer settings → Personal access tokens → Generate new token
```

### Push 실패
```bash
git pull origin main --rebase
git push origin main
```
