package com.eco.controller;

import com.eco.model.DashboardStats;
import com.eco.model.Emission;
import com.eco.model.SectorData;
import com.eco.service.EmissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for EmissionController
 */
class EmissionControllerTest {

    private EmissionController controller;
    private EmissionService service;

    @BeforeEach
    void setUp() {
        service = new EmissionService();
        controller = new EmissionController();
        // Use reflection or setter injection for testing
        try {
            java.lang.reflect.Field field = EmissionController.class.getDeclaredField("emissionService");
            field.setAccessible(true);
            field.set(controller, service);
        } catch (Exception e) {
            fail("Failed to inject service: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("Should return emissions list with 200 status")
    void testGetEmissions() {
        // When
        ResponseEntity<List<Emission>> response = controller.getEmissions();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
    }

    @Test
    @DisplayName("Should return dashboard stats with 200 status")
    void testGetDashboardStats() {
        // When
        ResponseEntity<DashboardStats> response = controller.getDashboardStats();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getTotalEmissions());
    }

    @Test
    @DisplayName("Should return sector data with 200 status")
    void testGetSectorData() {
        // When
        ResponseEntity<List<SectorData>> response = controller.getSectorData();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(5, response.getBody().size());
    }

    @Test
    @DisplayName("Should process valid chat query")
    void testProcessChatValid() {
        // Given
        Map<String, String> payload = new HashMap<>();
        payload.put("text", "What is the highest sector?");

        // When
        ResponseEntity<Map<String, String>> response = controller.processChat(payload);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("response"));
    }

    @Test
    @DisplayName("Should reject empty chat query")
    void testProcessChatEmpty() {
        // Given
        Map<String, String> payload = new HashMap<>();
        payload.put("text", "");

        // When
        ResponseEntity<Map<String, String>> response = controller.processChat(payload);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("error"));
    }

    @Test
    @DisplayName("Should reject null chat query")
    void testProcessChatNull() {
        // When
        ResponseEntity<Map<String, String>> response = controller.processChat(null);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("error"));
    }

    @Test
    @DisplayName("Should handle highest sector query")
    void testProcessChatHighest() {
        // Given
        Map<String, String> payload = new HashMap<>();
        payload.put("text", "highest");

        // When
        ResponseEntity<Map<String, String>> response = controller.processChat(payload);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        String responseText = response.getBody().get("response");
        assertTrue(responseText.contains("Energy") || responseText.contains("highest"));
    }
}

