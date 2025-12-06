# Emissions Project - Setup Guide








## Project Structure

```
emissions-project/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/eco/
│   │       │   ├── EcoDashboardApplication.java (Main class)
│   │       │   ├── controller/EmissionController.java (REST endpoints)
│   │       │   ├── model/Emission.java (Data model)
│   │       │   └── service/EmissionService.java (Business logic)
│   │       └── resources/
│   │           └── application.properties (Config)
│   └── pom.xml (Maven dependencies)
│
└── frontend/
    ├── src/
    │   ├── App.jsx (Main React component)
    │   ├── main.jsx (Entry point)
    │   └── index.css (Styles)
    ├── package.json (Node dependencies)
    └── vite.config.js (Vite configuration)
```

## API Endpoints

- `GET /api/v1/emissions` - Returns list of emission data
- `POST /api/v1/chat/query` - Processes chat queries
  - Body: `{ "text": "your question" }`
  - Response: `{ "response": "answer" }`



## Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser!

