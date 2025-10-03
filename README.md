# 📊 Marketing Performance Dashboard

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A comprehensive, interactive dashboard for visualizing and analyzing marketing campaign data. Built with Next.js, this application provides insights into campaign performance, demographic breakdowns, device usage, and regional impact. It's designed to help marketers make data-driven decisions by presenting complex data in an intuitive and accessible format.


## Features

-   **📈 Campaign Overview:** Analyze key metrics like spend, revenue, conversions, and ROAS across all campaigns.
-   **👥 Demographic Insights:** View performance data broken down by gender and age group to better understand your audience.
-   **📱 Device Performance:** Compare metrics between Desktop and Mobile users to optimize for different platforms.
-   **📅 Weekly Trends:** Track performance over time with dynamic line charts to identify patterns.
-   **🔍 Interactive Filtering & Sorting:** Dynamically filter campaigns by name or type and sort data tables to find the information you need quickly.
-   **🎨 Rich Data Visualization:** Utilizes clean and effective bar charts and line charts for clear data representation.
-   **Responsive Design:** A fully responsive interface that works seamlessly on desktops, tablets, and mobile devices.


## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) 14 (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** React Context API
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Data Fetching:** Next.js Route Handlers with built-in caching


## Project Structure
The project follows a standard Next.js App Router structure, separating concerns for scalability and maintainability.
```
.
├── app/
│   ├── api/                 # API routes for data fetching
│   ├── views/               # Dashboard pages/views
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main entry page
├── src/
│   ├── components/          # Reusable React components (charts, table, etc.)
│   ├── context/             # React Context for global state management
│   ├── lib/                 # Utility/library functions
│   └── types/               # TypeScript type definitions
├── .env.local.example       # Example environment variables
├── next.config.ts
└── package.json
```


## Prerequisites & Installation
Follow these instructions to get a local copy of the project up and running for development.

1. Make sure you have the following installed on your machine:
  * [Node.js](https://nodejs.org/en/) (v18.x or later)
  * [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

2. **Clone the repository:**
    ```bash
    git clone [https://github.com/dohmeid/marketing-dashboard.git]
    ```

3. **Navigate to the project directory:**
    ```bash
    cd marketing-dashboard
    ```

4. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    
5. Environment Variables: the application requires an API endpoint to fetch the marketing data from.
  * Create a `.env.local` file in the root of the project.
  * Add the following variable, pointing to your data source:
    ```
    API_URL="[https://.com/data]"
    ```
    
6. Running the Development Server
    ```bash
    npm run dev
    ```

7. Open http://localhost:3000 in your browser to see the dashboard in action.
