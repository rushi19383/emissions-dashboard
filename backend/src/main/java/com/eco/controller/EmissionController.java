package com.eco.controller;

import com.eco.constants.ApiConstants;
import com.eco.model.DashboardStats;
import com.eco.model.Emission;
import com.eco.model.SectorData;
import com.eco.service.EmissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Emission Dashboard API
 * Provides endpoints for emissions data, dashboard statistics, and chat functionality
 */
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH)
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"})
public class EmissionController {

    private static final Logger logger = LoggerFactory.getLogger(EmissionController.class);
    
    @Autowired
    private EmissionService emissionService;

    /**
     * Get all emission data for historical years
     * @return List of Emission objects containing yearly data
     */
    @GetMapping("/emissions")
    public ResponseEntity<List<Emission>> getEmissions() {
        try {
            logger.info("Fetching all emissions data");
            List<Emission> emissions = emissionService.getAllEmissions();
            logger.debug("Retrieved {} emission records", emissions.size());
            return ResponseEntity.ok(emissions);
        } catch (Exception e) {
            logger.error("Error fetching emissions data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get dashboard statistics (total emissions, top sector, etc.)
     * @return DashboardStats object with summary statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        try {
            logger.info("Fetching dashboard statistics");
            DashboardStats stats = emissionService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get sector data for pie chart visualization
     * @return List of SectorData objects with name, value, and color
     */
    @GetMapping("/dashboard/sectors")
    public ResponseEntity<List<SectorData>> getSectorData() {
        try {
            logger.info("Fetching sector data");
            List<SectorData> sectors = emissionService.getSectorData();
            return ResponseEntity.ok(sectors);
        } catch (Exception e) {
            logger.error("Error fetching sector data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Process chat query and return response
     * @param payload Request body containing "text" field with user query
     * @return Map with "response" field containing bot response
     */
    @PostMapping("/chat/query")
    public ResponseEntity<Map<String, String>> processChat(@RequestBody Map<String, String> payload) {
        try {
            // Validate input
            if (payload == null || payload.get("text") == null || payload.get("text").trim().isEmpty()) {
                logger.warn("Invalid chat query received: empty or null text");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Text field is required and cannot be empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String input = payload.get("text").trim().toLowerCase();
            logger.info("Processing chat query: {}", input);
            
            String response = "I am a basic Java Backend. You asked: " + input;
            
            if (input.contains("highest") || input.contains("highest")) {
                response = "Based on backend data, Energy (" + ApiConstants.ENERGY_2023.intValue() + ") is the highest sector.";
            } else if (input.contains("solution") || input.contains("solve")) {
                response = "Backend insight: Reduce fossil fuels and increase renewable energy adoption.";
            } else if (input.contains("total") || input.contains("sum")) {
                response = "Total emissions for 2023: " + ApiConstants.TOTAL_EMISSIONS_2023.intValue() + " MtCO2e";
            } else if (input.contains("trend") || input.contains("change")) {
                response = "Emissions dipped in 2020 due to the pandemic but have rebounded in recent years.";
            }
            
            logger.debug("Chat response generated: {}", response);
            return ResponseEntity.ok(Map.of("response", response));
            
        } catch (Exception e) {
            logger.error("Error processing chat query", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred while processing your query");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}