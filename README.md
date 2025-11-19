## Demo

- **Live Demo:** ......
- **Repository:** ......

## Tech Stack

The project utilizes the following core technologies:

- **Core:** [Next.js 16](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/).
- **UI Component:** [Ant Design 5.28.1](https://ant.design/).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Layout & Spacing utility) combined with Ant Design Theme.
- **Icon:** Lucide React / Ant Design Icons.
- **State Management:** URL Search Params (Native Next.js hooks).
- **Deploy:** Vercel.

## Installation and Setup

Ensure your machine has Node.js installed (v18+ recommended).

1.  **Clone repository:**

    ```bash
    git clone [https://github.com/](https://github.com/)[username]/tripzy-frontend-test-[your-name].git
    cd tripzy-frontend-test-[your-name]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run Development Environment:**

    ```bash
    npm run dev
    # Server will start at http://localhost:3000
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    npm start
    ```

## Folder Structure

```
├── app/
│   ├── layout.tsx      # Root layout, Antd Registry & Global Styles configuration
│   ├── page.tsx        # Homepage (Form search)
│   ├── search          # Search Result Page
│   └── data            # Mock data
├── components/         # Reusable UI components
├── public/             # Static assets (images)
└── ...
```

## Architecture & Technical Decisions

### 1. Integrating Ant Design & Tailwind CSS

- **Problem:** Ant Design has its own styling system, which sometimes conflicts with Tailwind's preflight or utility classes.
- **Solution:**
  - Used `AntdRegistry` to properly render styles on the server-side (SSR), adhering to Next.js App Router standards.
  - Used **Tailwind** primarily for Layout, Spacing (margin/padding), and Responsiveness (grid/flex).
  - Used **Ant Design** for complex interactive components (DatePicker, AutoComplete, Form Validation) to save development time and ensure standard UX.
  - Configured `theme` in Antd's `ConfigProvider` to match colors with the Figma design instead of manually overriding CSS.

### 2. URL-based State Management

- Instead of using Redux or Context API to pass data from the Home page to the Search page, I utilized **URL Search Params**.
- **Reasoning:**
  - Persistence: Search results are not lost when the user reloads the `/search` page.
  - Shareability: Users can easily share search result links (Shareable URLs).
  - Logic: On form submit -> `router.push` with query string -> Search Page reads query string to display data.

### 3. Form Handling & Validation

- Utilized Ant Design's `Form` component.
- **Validation Logic:**
  - Mandatory fields (From, To, Departure Date) have `required` rules.
  - **Return Date:** Implemented custom validator logic to ensure the return date is greater than or equal to the departure date (`returnDate >= departureDate`).
  - **Autocomplete:** Loads data from a local JSON file (simulating an API call) and filters directly on the client side.

### 4. Client vs Server Components

- The Homepage contains the Form with many interactions (input, click, validate), so it is marked as `'use client'`.
- The Main Layout and static parts remain Server Components to optimize initial performance (FCP).

## Completed Features

---

_Implemented by Nguyen Chau Thach_
