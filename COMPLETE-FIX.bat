@echo off
echo ========================================
echo  REAL ESTATE PLATFORM - COMPLETE FIX
echo ========================================
echo.

echo Step 1: Stopping all Node processes...
taskkill /f /im node.exe 2>nul
echo.

echo Step 2: Checking Node.js version...
node --version
echo.
echo WARNING: You have Node.js 20.18.0
echo Vite 7.1.5 requires Node.js 20.19+ or 22.12+
echo.

echo Step 3: Cleaning corrupted installation...
cd /d "E:\Real_State_App\real-estate-frontend"
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo.

echo Step 4: Installing compatible Vite version...
npm install vite@4.5.3 --save-dev
echo.

echo Step 5: Installing all dependencies...
npm install react-router-dom@6.28.0
npm install framer-motion@11.11.17
npm install lucide-react@0.468.0
npm install react-hot-toast@2.4.1
npm install recharts@2.12.7
npm install -D @tailwindcss/forms@0.5.10
npm install -D @tailwindcss/typography@0.5.16
echo.

echo Step 6: Verifying installation...
npm list vite react react-dom
echo.

echo ========================================
echo  FIX COMPLETE!
echo ========================================
echo.
echo Now run: npm run dev
echo.
pause
