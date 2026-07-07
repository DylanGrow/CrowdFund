# CompTIA Security+ Crowdfunding Campaign

A production-ready, visually stunning, privacy-first static crowdfunding single-page website. Engineered with a strict Content Security Policy (CSP), zero external runtime dependencies, progressive web application (PWA) installation features, and a dynamic progress simulator.

Live Site: **[https://dylangrow.github.io/CrowdFund/](https://dylangrow.github.io/CrowdFund/)**

---

## 🔒 Security Architecture (Government-Grade)

This page was built with a strict security profile to demonstrate defensive engineering principles:
*   **Strict Content Security Policy (CSP)**: Inline scripting, external frames, object injection, and unauthorized network queries are strictly blocked at the browser level.
*   **XSS Immunity**: Dynamic updates to the DOM are mapped strictly to text nodes and input attributes, making client-side code completely immune to Cross-Site Scripting (XSS).
*   **Anti-Clickjacking**: Protected by frame-ancestors policies and secondary client-side frame-busting scripts.
*   **Zero Third-Party Tracking**: Completely cookie-free and tracking-free. System typography is used instead of remote font fetches (e.g., Google Fonts) to prevent third-party logging.
*   **Referrer Leak Protection**: Built with a strict `no-referrer` policy to protect contributor privacy when clicking outbound payment links.

---

## ✨ Features

*   **PWA Offline Caching**: Runs a Stale-While-Revalidate service worker (`sw.js`) that caches sitemaps, manifests, and compiled assets for offline usage.
*   **PWA Install Button**: Native header button triggers standard installation banners on supported browsers (desktop & mobile).
*   **Color Theme Cycler**: Cycle between **Emerald Matrix (default)**, **Cyberpunk Amber**, and **Quantum Cobalt** theme profiles. Choices are persisted via `localStorage`.
*   **Contribution Estimator**: Real-time interactive tool. Preset quick-chips ($10, $25, $50, $100, $411) and custom sliders show the exact breakdown of how your contribution funds materials vs exam vouchers.
*   **Dynamic Study Roadmap**: Visual vertical timeline milestones (Study materials, training courses, practice exam thresholds, exam schedule dates) that visually advance and check themselves off based on the campaign's raised funding totals.
*   **Developer Simulator**: Floating drawer widget in the bottom-right corner to test transitions, progress bar width, HSL color theme sweeps, and responsive design boundaries in real-time.

---

## 🛠️ Tech Stack

*   **Core**: HTML5 (Semantic Structure) & TypeScript (XSS-Safe Logic)
*   **Styles**: Tailwind CSS (Utility classes mapped to HSL color variables)
*   **Bundling**: Vite & PostCSS (Optimized production assets compile under **75 kB total**)
*   **Automation**: GitHub Actions (CI/CD pipeline for Pages compilation)

---

## 🚀 Getting Started

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/DylanGrow/CrowdFund.git
    cd CrowdFund
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run dev server**:
    ```bash
    npm run dev
    ```
    The application will run locally at `http://localhost:3000`.

4.  **Production build**:
    ```bash
    npm run build
    ```
    Static files compile into the `/dist` directory.

---

## ⚙️ Customizing Campaign Variables

To update the campaign name, CashApp handle, goals, raised amounts, or study timelines:
1.  Open [src/main.ts](src/main.ts).
2.  Locate the `CAMPAIGN_CONFIG` constant at the top of the file:
    ```typescript
    const CAMPAIGN_CONFIG = {
      campaignName: "CompTIA Security+ Certification Fund",
      goalAmount: 431.00,
      raisedAmount: 185.00, // Update this value when you receive contributions
      cashAppHandle: "$SecurityFund", // Your CashApp tag
      contributorCount: 14,
      daysRemaining: 24
    };
    ```
3.  Modify the parameters. Save the file and run `npm run build`. The progress bars, roadmap timeline markers, checkmarks, sitemaps, and estimation bounds will automatically recalculate.

---

## 📦 Deploying to GitHub Pages

The repository contains an automated deployment pipeline at `.github/workflows/deploy.yml`. 

1.  Push your files to the `main` branch.
2.  Open your repository on GitHub: **[https://github.com/DylanGrow/CrowdFund](https://github.com/DylanGrow/CrowdFund)**.
3.  Go to **Settings** > **Pages** in the sidebar.
4.  Under **Build and deployment** > **Source**, switch the dropdown from *Deploy from a branch* to **GitHub Actions**.
5.  Every push to `main` will now trigger a compile and redeploy automatically in under a minute!
