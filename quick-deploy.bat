@echo off
echo ========================================
echo   빠른 배포 (로그인 생략)
echo ========================================
echo.

echo [1/2] 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo [오류] 빌드 실패!
    pause
    exit /b 1
)

echo.
echo [2/2] 배포 중...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo [오류] 배포 실패!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   배포 완료! 🎉
echo ========================================
echo.
echo URL: https://costco-df701.web.app
echo.
pause
