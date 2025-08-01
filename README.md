# React File Converter with Sentry Integration

A React application that simulates a file conversion service with Sentry performance monitoring integration.

## 🚀 Features

- **Drag & Drop Upload** - Intuitive file upload with visual feedback
- **Professional UI** - Modern, responsive design with smooth animations  
- **Conversion Simulation** - Mimics real backend API calls with loading states
- **Sentry Integration** - Performance monitoring with custom spans and HTTP tracing
- **File Metadata Display** - Shows file name, size, type, and compression stats

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🛠️ Local Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd react-file-converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   The Sentry DSN is stored in `.env` file. Update if needed:
   ```bash
   VITE_SENTRY_DSN=your_sentry_dsn_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173/`

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Sentry Integration Details

### Configuration

Sentry is initialized in `src/main.jsx` with the following setup:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  debug: true,
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
});
```

The DSN is stored in the `.env` file as `VITE_SENTRY_DSN` for security and configurability.

### Custom Span Implementation

A custom Sentry span is implemented in `src/App.jsx` within the `handleConvert` function:

**Location:** Lines 47-95 in `src/App.jsx`

**Implementation:**
```javascript
await Sentry.startSpan(
  {
    name: 'file_conversion',
    op: 'file.convert',
    attributes: {
      'file.name': selectedFile.name,
      'file.size': selectedFile.size,
      'file.type': selectedFile.type || 'unknown'
    }
  },
  async () => {
    // File conversion logic here
  }
)
```

### What Sentry Captures

1. **Custom Span** - `file_conversion` operation tracking the entire conversion process
2. **HTTP Span** - Automatic instrumentation of the fetch request to the demo API
3. **Custom Attributes:**
   - `file.name` - Name of the uploaded file
   - `file.size` - File size in bytes  
   - `file.type` - MIME type of the file
4. **Performance Metrics** - Duration, timing, and any errors during conversion

### API Used

- **Sentry React SDK:** `@sentry/react` v10.0.0
- **Key Methods:**
  - `Sentry.init()` - SDK initialization
  - `Sentry.startSpan()` - Custom span creation
  - `Sentry.browserTracingIntegration()` - Automatic HTTP request tracing

