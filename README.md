# Emissions Dashboard Project

A full-stack application for tracking and visualizing global carbon emissions data with an interactive dashboard and intelligent chat assistant.

## 🚀 Quick Start

### Prerequisites
- **Java JDK 17** - [Download](https://adoptium.net/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** - [Download](https://nodejs.org/)

### Run the Project

**1. Start Backend (Terminal 1):**
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

**2. Start Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

**3. Open Browser:**
Navigate to `http://localhost:5173` to see the dashboard!

## 📋 Features

- 📊 **Interactive Dashboard** - Visualize emissions data with charts and graphs
- 🏭 **Sector Analysis** - Detailed breakdown by Energy, Transport, Industry, Agriculture, and Buildings
- 💬 **Chat Assistant** - Ask questions about emission trends and data (rule-based responses)
- 📈 **RESTful API** - Spring Boot backend serving data via REST endpoints
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and Recharts
- 📚 **API Documentation** - Swagger/OpenAPI for easy API exploration
- ✅ **Unit Tests** - Comprehensive test coverage for backend services

## 🏗️ Tech Stack

**Backend:**
- Spring Boot 3.1.5
- Java 17
- Maven
- REST API
- Swagger/OpenAPI (API Documentation)
- SLF4J/Logback (Logging)
- JUnit 5 (Testing)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)

## 📁 Project Structure

```
emissions-project/
├── backend/                          # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/eco/
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   │   └── EmissionController.java
│   │   │   │   ├── service/          # Business logic (HARDCODED DATA HERE)
│   │   │   │   │   └── EmissionService.java
│   │   │   │   ├── model/            # Data models
│   │   │   │   │   ├── Emission.java
│   │   │   │   │   ├── DashboardStats.java
│   │   │   │   │   └── SectorData.java
│   │   │   │   ├── constants/        # Application constants
│   │   │   │   │   └── ApiConstants.java
│   │   │   │   ├── config/           # Configuration classes
│   │   │   │   │   └── OpenApiConfig.java
│   │   │   │   └── EcoDashboardApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                     # Unit tests
│   │       └── java/com/eco/
│   │           ├── service/
│   │           │   └── EmissionServiceTest.java
│   │           └── controller/
│   │               └── EmissionControllerTest.java
│   └── pom.xml                       # Maven dependencies
│
└── frontend/                          # React Dashboard
    ├── src/
    │   ├── App.jsx                   # Main React component
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Styles
    ├── package.json                  # Node dependencies
    ├── vite.config.js                 # Vite configuration
    └── tailwind.config.js             # Tailwind CSS config
```

## 📖 Detailed Setup

For comprehensive setup instructions, troubleshooting, and development tips, see [SETUP.md](./SETUP.md)

## 🔌 API Endpoints

- `GET /api/v1/emissions` - Get all emission data
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/sectors` - Get sector data for charts
- `POST /api/v1/chat/query` - Process chat queries

## 📚 API Documentation

Once the backend is running, access Swagger UI at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/api-docs`

## ✅ Testing

Run unit tests:
```bash
cd backend
mvn test
```

## 🐛 Troubleshooting

- **Backend won't start?** Check Java version: `java -version` (needs JDK 17)
- **Frontend can't connect?** Ensure backend is running on port 8080
- **Port conflicts?** See [SETUP.md](./SETUP.md) for solutions

## 💾 Data Storage & Architecture

### Hardcoded Data (Current Implementation)

**Important Note for Reviewers/Judges:**

All data in this project is currently **hardcoded** in the backend service layer. This is an intentional design decision for the following reasons:

1. **No Database/Data Available**: We don't have a database and data as of now. The data layer can be easily swapped with a database implementation when we have the database and data available.

**Where Data is Stored:**
- Location: `backend/src/main/java/com/eco/service/EmissionService.java`
- Data includes:
  - Historical emission data (2019-2023) for 5 sectors
  - Dashboard statistics (total emissions, top sector, net zero target, alerts)
  - Sector data for visualization (name, value, color)

**Future Database Integration:**
When we have a database and data available, we can:
1. Uncomment database dependencies in `pom.xml` (H2, PostgreSQL, etc.)
2. Add JPA entities and repositories
3. Replace hardcoded data with database queries
4. The REST API structure remains the same - no frontend changes needed!

See `backend/pom.xml` lines 40-51 for commented database configuration examples.

---

## 💬 Chat Assistant Details

### Current Implementation

**Important**: The chat assistant is **NOT connected to any AI/LLM model** (OpenAI, Anthropic, etc.). It uses **rule-based pattern matching** to provide responses.

**How It Works:**
- The backend analyzes user input for specific keywords
- Based on keyword matches, it returns predefined responses

### Supported Questions/Keywords

The chatbot recognizes the following patterns and provides relevant responses:

| Keyword/Pattern | Example Questions | Response Type |
|----------------|-------------------|---------------|
| `highest`, `most` | "What is the highest sector?"<br>"Which sector has most emissions?" | Returns Energy sector with value (4250 MtCO2e) |
| `solution`, `solve` | "What are solutions?"<br>"How to solve emissions?" | Returns suggestions about renewable energy |
| `total`, `sum` | "What is total emissions?"<br>"Sum of all sectors?" | Returns total emissions for 2023 (11,890 MtCO2e) |
| `trend`, `change` | "What are the trends?"<br>"How have emissions changed?" | Returns information about pandemic impact and rebound |

**Example Interactions:**
```
User: "What is the highest sector?"
Bot: "Based on backend data, Energy (4250) is the highest sector."

User: "What are solutions to reduce emissions?"
Bot: "Backend insight: Reduce fossil fuels and increase renewable energy adoption."

User: "What is the total emissions?"
Bot: "Total emissions for 2023: 11890 MtCO2e"
```

### Future AI Integration

To enhance the chatbot with real AI capabilities, you can integrate:

#### Option 1: OpenAI API
```java
// Add to pom.xml
<dependency>
    <groupId>com.theokanning.openai-gpt3-java</groupId>
    <artifactId>service</artifactId>
    <version>0.18.0</version>
</dependency>

// In EmissionService or new ChatService
@Service
public class ChatService {
    private OpenAiService openAiService;
    
    public String processWithAI(String userQuery) {
        // Get context from emission data
        String context = buildContextFromEmissions();
        
        // Call OpenAI API
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo")
            .messages(Arrays.asList(
                new ChatMessage("system", "You are an emissions data assistant..."),
                new ChatMessage("user", context + "\n\nUser question: " + userQuery)
            ))
            .build();
        
        return openAiService.createChatCompletion(request)
            .getChoices().get(0).getMessage().getContent();
    }
}
```

#### Option 2: Anthropic Claude API


#### Option 3: Google Gemini API

#### Option 4: Local LLM (Ollama, etc.)


**Benefits of AI Integration:**
- ✅ Natural language understanding
- ✅ Context-aware responses
- ✅ Ability to answer complex questions
- ✅ Conversational flow
- ✅ Data analysis and insights

**Configuration Needed:**
1. Add API key to `application.properties`:
   ```properties
   openai.api.key=your-api-key-here
   ```
2. Create environment variable or use Spring Cloud Config
3. Add error handling for API failures
4. Implement rate limiting and caching

---

## 🎯 Project Architecture Decisions

### Why These Choices?

1. **Spring Boot**: Industry-standard Java framework, easy to extend
2. **React + Vite**: Modern, fast frontend development
5. **REST API**: Standard, easy to integrate with any frontend
6. **Swagger**: Self-documenting API for easy testing

### Scalability Path

This project is designed to scale:
- ✅ Add database → Replace service methods with repository calls
- ✅ Add AI → Enhance chat endpoint with LLM integration
- ✅ Add authentication → Use Spring Security
- ✅ Add caching → Use Redis or Spring Cache
- ✅ Deploy to cloud → Containerize with Docker

---
