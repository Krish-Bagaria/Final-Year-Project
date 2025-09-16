# RealEstatePro (India) – Frontend

A modern real estate web application focused on the Indian market. It showcases properties, market trends, ROI analytics, a smart search experience, and a mortgage calculator, using clean, modular React components with Tailwind CSS and Vite.

This project currently uses mock/sample data representing Indian cities and areas. AI-powered predictions and backend integration will be added later.

## Tech Stack

- React 18 + Vite
- TypeScript (app scaffolding) with mixed TS/JS components
- Tailwind CSS + PostCSS
- Recharts (data visualization)
- Framer Motion (animations)
- React Router DOM
- Lucide React (icons)
- react-hot-toast (notifications)

## Project Structure

High-level structure under `Final-Year-Project/`:

```
Final-Year-Project/
  ai-models/
  backend/
  public/
  src/
    assets/
    components/
      charts/
        InvestmentChart.jsx
        MarketTrendChart.jsx
        PropertyPerformanceChart.jsx
      dashboard/
        QuickStats.jsx
        RecentProperties.jsx
        ROICalculator.jsx
      layouts/
        Footer.jsx
        Navbar.jsx
      property/
        FilterSidebar.jsx
        PropertyCard.jsx
        PropertyList.jsx
      ui/
        FeatureSection.jsx
        HeroSection.jsx
        StatsSection.jsx
        TestimonialSection.jsx
    constants/
      styles.js
      styles.ts
    context/
      AuthContext.jsx
      DashboardContext.jsx
    pages/
      About.jsx
      Admin.jsx
      Contact.jsx
      Dashboard.jsx
      Home.jsx
      Login.jsx
      NotFound.jsx
      Profile.jsx
      Properties.jsx
      PropertyDetails.jsx
      Register.jsx
      SmartSearch.jsx
      InvestmentAnalytics.jsx
      MortgageCalculator.jsx
      MarketInsights.jsx
    sampleData/
      properties.in.json
      marketTrends.in.json
      historicalPrices.in.json
    types/
    main.tsx
    index.css
  package.json
  vite.config.ts
  tailwind.config.js
  eslint.config.js
```

## Key Features (Current)

- Indian market focus using INR formatting and Indian cities/areas
- Properties listing with advanced filters and grid/list views
- Property details page with pricing, amenities, and ROI highlights
- Dashboard with:
  - Investment Performance chart (Real Estate in INR)
  - Market Trends chart for Indian areas
  - Property Performance chart
  - ROI Calculator widget
  - Recent properties and quick actions
- Smart Property Search page (client-side filterable list)
- Investment Analytics page (charts + placeholder for AI predictions)
- Mortgage Calculator (EMI computation in INR)
- Market Insights (market trend chart; placeholder for area selection and AI)
- Homepage with hero, features, stats, featured properties, testimonials, and CTAs

## Data and Mock Sources

All data is currently mocked and loaded on the client.

- `src/sampleData/properties.in.json`: Indian properties (Bengaluru, Mumbai, Gurugram, etc.).
- `src/sampleData/marketTrends.in.json`: Area-level trend aggregates with monthly history.
- `src/sampleData/historicalPrices.in.json`: Price-per-sqft history for known areas (for future use on details/charts).

The `DashboardContext` hydrates the app from these files and disables any stock comparison logic for now.

## Routes

- `/` – Home
- `/properties` – Properties (filterable/searchable)
- `/property/:id` – Property Details
- `/dashboard` – Dashboard (no auth gate yet)
- `/smart-search` – Smart Property Search
- `/investment-analytics` – Investment Analytics
- `/mortgage-calculator` – Mortgage Calculator
- `/market-insights` – Market Insights
- `/about`, `/contact`, `/login`, `/register`, `/profile`, `/admin`, `*` (NotFound)

## Important Components

- Charts
  - `InvestmentChart.jsx`: Real estate performance in INR (removed stocks)
  - `MarketTrendChart.jsx`: City/area averages in INR
  - `PropertyPerformanceChart.jsx`: ROI bar chart per property
- Property UI
  - `PropertyCard.jsx`, `PropertyList.jsx`: INR price formatting, Indian cities
  - `FilterSidebar.jsx`: Indian locations, INR price ranges, bedrooms/bathrooms, amenities
- Dashboard
  - `Dashboard.jsx`: Uses `DashboardContext` data; shows charts, ROI calculator, recent properties, quick actions
  - `DashboardContext.jsx`: Central data provider that loads from `sampleData`
- UI Sections
  - `FeatureSection.jsx`: Feature cards link to pages (Smart Search, Analytics, Mortgage, Insights)
  - `HeroSection.jsx`, `StatsSection.jsx`, `TestimonialSection.jsx`

## Currency and Localization

- All monetary values are rendered using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` with zero fractional digits where appropriate.

## Getting Started

Prerequisites:

- Node.js 18+

Install and run:

```
npm install
npm run dev
```

Build and preview:

```
npm run build
npm run preview
```

Helpful scripts in repo root:

- `install-all.bat`, `install-deps.bat`, `fix-dependencies.bat`, `COMPLETE-FIX.bat` – Windows helper scripts

## Styling

- Tailwind CSS is configured via `tailwind.config.js` and `postcss.config.js`.
- Global styles in `src/index.css`. Maintain utility-first approach and avoid inline styles except where small and scoped.

## Linting & Type Safety

- ESLint configured via `eslint.config.js`.
- Project includes TypeScript config files; many components are JS today but TS can be adopted incrementally.

## Current Limitations / Next Steps

- Backend/API: All data is mocked on the client. Add API layer and data persistence.
- AI Predictions: Placeholders are present in Analytics/Insights; integrate AI models from `ai-models/` and display future projections.
- Area Trend on Property Details: `historicalPrices.in.json` is prepared; surface a chart on property details based on `location.area`.
- Authentication/Authorization: `AuthContext` is scaffolded; enable route guards and role-based access where needed.
- Testing: Add unit/integration tests (e.g., React Testing Library, Vitest).
- Accessibility: Audit for a11y and keyboard navigation.

## How the Project Works

This frontend uses client-side routing, a central data context, and modular components:

- App Shell and Routing
  - `src/main.tsx` mounts the React app.
  - `src/App.jsx` sets up `AuthProvider` and `DashboardProvider`, configures routes using React Router, and renders `Navbar` and `Footer` around the page content.

- Data Flow
  - `DashboardContext.jsx` reads from `src/sampleData/*.json` on load and exposes:
    - `properties`, `roiData`, `marketTrends`, `loading`, `error`, `refreshData()`
  - All pages/components subscribe via `useDashboard()` to consume data.

- Visualization
  - Recharts components (`InvestmentChart`, `MarketTrendChart`, `PropertyPerformanceChart`) render charts with INR currency formatting and responsive containers.

- Styling & UX
  - Tailwind utility classes compose the UI.
  - Framer Motion adds subtle enter/hover animations.
  - Lucide icons provide consistent iconography.
  - `react-hot-toast` is used for non-blocking notifications (e.g., data refresh).

- Internationalization (INR)
  - Monetary values are formatted with `Intl.NumberFormat('en-IN', { currency: 'INR' })` across property cards, lists, charts, and details.

## Feature Walkthroughs (What each feature does)

- Home
  - Hero, platform features, stats, testimonials, and CTAs.
  - Feature cards link to Smart Search, Investment Analytics, Mortgage Calculator, and Market Insights.
  - Featured Properties section displays a subset of properties from context.

- Properties
  - Filterable/searchable catalog showing grid or list layout.
  - Filters: price range (INR), property type, bedrooms, bathrooms, area, location (Indian cities), features, amenities, category, year built.
  - Sorting: price, area, date added, ROI.
  - Selecting a card navigates to the details page.

- Property Details
  - Large image gallery with status and category badges.
  - INR pricing and optional AI price prediction preview.
  - Location, description, features, amenities, metadata (area, beds, baths, year).
  - ROI section (if available) summarizing ROI, cap rate, monthly rent, appreciation.
  - Future: area price history chart using `historicalPrices.in.json`.

- Dashboard
  - Investment Performance (INR line chart) – real estate performance over time.
  - Market Trends (INR bar chart) – area/city averages and volumes.
  - Property Performance – ROI bars by property.
  - ROI Calculator – quick estimation widget.
  - Recent Properties and Quick Actions.

- Smart Property Search
  - Lightweight, client-side search across title, city, and area.
  - Returns a concise list for quick navigation.

- Investment Analytics
  - Displays investment chart and provides space for AI-driven forecasts (placeholder note).

- Mortgage Calculator
  - EMI computation using standard amortization formula.
  - Inputs: loan amount (INR), annual interest rate, tenure in years.
  - Output: estimated monthly payment formatted in INR.

- Market Insights
  - Market trend chart for Indian areas with placeholders for future AI predictions and user-selectable area filters.

## Typical User Flows

- Browsing Properties
  1. Visit `/properties` and apply filters (e.g., city, price range in INR).
  2. Toggle grid/list; sort by price or ROI.
  3. Click a property to view `PropertyDetails` with pricing and amenities.

- Exploring Market Data
  1. Open `/dashboard` to view overall performance and area trends.
  2. Or go to `/market-insights` for a focused trends view.

- Analyzing Investments
  1. Visit `/investment-analytics` to see performance charts.
  2. Use `/mortgage-calculator` to estimate EMI for a target property value.

## Contributing Guidelines

- Keep components small, composable, and reusable.
- Use meaningful names and clear props; avoid abbreviations.
- Prefer early returns and flat control flow.
- Add concise comments only for non-obvious intent or complex logic.
- Maintain consistent formatting and avoid large unrelated diffs.

## License

This project is for educational/demo purposes. Add your license as needed.
