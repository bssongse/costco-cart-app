@echo off
echo ========================================
echo   코스트코 장바구니 앱 배포 스크립트
echo ========================================
echo.

echo [1/3] 프로덕션 빌드 생성 중...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [오류] 빌드 실패!
    pause
    exit /b 1
)

echo.
echo [2/3] Firebase 로그인 확인 중...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo Firebase에 로그인되어 있지 않습니다.
    echo 브라우저가 열리면 Google 계정으로 로그인해주세요.
    echo.
    firebase login
    if %errorlevel% neq 0 (
        echo [오류] 로그인 실패!
        pause
        exit /b 1
    )
)

echo.
echo [3/3] Firebase Hosting에 배포 중...
firebase deploy
if %errorlevel% neq 0 (
    echo.
    echo [오류] 배포 실패!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   배포 완료! 🎉
echo ========================================
echo.
echo 배포된 URL:
echo https://costco-df701.web.app
echo https://costco-df701.firebaseapp.com
echo.
pause
