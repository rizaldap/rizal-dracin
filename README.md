# Rizal Dracin - Drama Streaming Platform

A modern drama streaming web application built with Next.js 14, featuring a sleek dark theme UI and integrated video player.

## 🎬 About This Project

**Rizal Dracin** is a drama streaming platform that allows users to browse, search, and watch drama series. The application features:

- **Modern UI/UX**: Dark theme with gradient accents and smooth animations
- **Video Player**: Custom player with HLS and MP4 support, quality switching, and server selection
- **Real-time Data**: Live data from the Dramabox API
- **Responsive Design**: Optimized for all device sizes

## 📡 API Source

This project uses the **Dramabox API** provided by:

```
https://dramabox.sansekai.my.id/api/dramabox
```

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/dramabox/foryou` | Featured/recommended dramas |
| `/api/dramabox/trending` | Currently trending dramas |
| `/api/dramabox/latest` | Latest updated dramas |
| `/api/dramabox/search?query={keyword}` | Search dramas by keyword |
| `/api/dramabox/allepisode?bookId={id}` | Get all episodes for a drama |

### API Response Structure

**Drama Object:**
```json
{
  "bookId": "42000000226",
  "bookName": "Drama Title",
  "cover": "https://...",
  "introduction": "Synopsis...",
  "chapterCount": 80,
  "tagNames": ["Romance", "CEO"],
  "playCount": "1.2M"
}
```

**Episode Object:**
```json
{
  "chapterId": "700017020",
  "chapterIndex": 0,
  "chapterName": "EP 1",
  "cdnList": [
    {
      "cdnDomain": "hwztakavideo.dramaboxdb.com",
      "videoPathList": [
        { "quality": 1080, "videoPath": "https://..." },
        { "quality": 720, "videoPath": "https://..." }
      ]
    }
  ]
}
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Player**: hls.js for HLS streams + native HTML5 for MP4
- **State Management**: React hooks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rizal-dracin.git
   cd rizal-dracin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── drama/[slug]/       # Drama detail page
│   ├── watch/[dramaId]/[episodeId]/  # Video player page
│   ├── search/             # Search page
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── home/               # Homepage components
│   ├── drama/              # Drama-related components
│   └── player/             # Video player components
├── lib/                    # Utility functions
│   ├── api.ts              # API client
│   ├── config.ts           # App configuration
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript interfaces
    └── drama.ts            # Data type definitions
```

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the Dramabox API |

## 📝 License

This project is for educational purposes only. All drama content is provided by third-party APIs.

---

Made with ❤️ by Rizalda P.
