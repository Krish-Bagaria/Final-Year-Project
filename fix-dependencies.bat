@echo off
echo Fixing React Dependencies for Real Estate Platform...
echo.

echo Step 1: Stopping any running processes...
taskkill /f /im node.exe 2>nul
echo.

echo Step 2: Installing core dependencies...
npm install react-router-dom@6.28.0
npm install framer-motion@11.11.17
npm install lucide-react@0.468.0
npm install react-hot-toast@2.4.1
npm install recharts@2.12.7

echo.
echo Step 3: Installing Tailwind CSS plugins...
npm install -D @tailwindcss/forms@0.5.10
npm install -D @tailwindcss/typography@0.5.16

echo.
echo Step 4: Verifying installation...
npm list react react-dom react-router-dom framer-motion lucide-react

echo.
echo Dependencies installation complete!
echo.
echo Now you can run: npm run dev
pause
