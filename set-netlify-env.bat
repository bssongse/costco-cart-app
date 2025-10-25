@echo off
echo Netlify 환경 변수 설정 스크립트
echo.
echo 먼저 Netlify에 로그인해야 합니다.
echo.

netlify login

echo.
echo 환경 변수를 설정합니다...
echo.

netlify env:set VITE_FIREBASE_API_KEY "AIzaSyCimk8tXOfBZtKOwe5qKXbuvcQpOOJtFuQ"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "costco-df701.firebaseapp.com"
netlify env:set VITE_FIREBASE_PROJECT_ID "costco-df701"
netlify env:set VITE_FIREBASE_STORAGE_BUCKET "costco-df701.firebasestorage.app"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "133851906421"
netlify env:set VITE_FIREBASE_APP_ID "1:133851906421:web:37889526a5a8e924e8d33c"

echo.
echo 환경 변수 설정 완료!
echo.
echo 이제 다시 배포해야 합니다:
echo netlify deploy --prod
echo.
pause
