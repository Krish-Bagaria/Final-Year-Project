@echo off
echo Installing all dependencies for Real Estate Frontend...
echo.

echo Installing main dependencies...
npm install react-router-dom@^6.28.0 framer-motion@^11.11.17 lucide-react@^0.468.0 react-hot-toast@^2.4.1 recharts@^2.12.7

echo.
echo Installing Tailwind CSS plugins...
npm install -D @tailwindcss/forms@^0.5.10 @tailwindcss/typography@^0.5.16

echo.
echo All dependencies installed successfully!
echo.
echo You can now run: npm run dev
pause
