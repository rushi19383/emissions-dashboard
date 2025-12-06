package com.eco.service;

import com.eco.constants.ApiConstants;
import com.eco.model.DashboardStats;
import com.eco.model.Emission;
import com.eco.model.SectorData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

/**
 * Unit tests for EmissionService
 */
class EmissionServiceTest {

    private EmissionService emissionService;

    @BeforeEach
    void setUp() {
        emissionService = new EmissionService();
    }

    @Test
    @DisplayName("Should return all emissions data")
    void testGetAllEmissions() {
        // When
        List<Emission> emissions = emissionService.getAllEmissions();

        // Then
        assertNotNull(emissions);
        assertEquals(5, emissions.size());
        assertEquals("2019", emissions.get(0).getYear());
        assertEquals("2023", emissions.get(4).getYear());
    }

    @Test
    @DisplayName("Should return 2023 emission data with correct values")
    void testGetAllEmissions2023Data() {
        // When
        List<Emission> emissions = emissionService.getAllEmissions();
        Emission emission2023 = emissions.stream()
                .filter(e -> "2023".equals(e.getYear()))
                .findFirst()
                .orElse(null);

        // Then
        assertNotNull(emission2023);
        assertEquals(ApiConstants.ENERGY_2023, emission2023.getEnergy());
        assertEquals(ApiConstants.TRANSPORT_2023, emission2023.getTransport());
        assertEquals(ApiConstants.INDUSTRY_2023, emission2023.getIndustry());
        assertEquals(ApiConstants.AGRICULTURE_2023, emission2023.getAgriculture());
        assertEquals(ApiConstants.BUILDINGS_2023, emission2023.getBuildings());
    }

    @Test
    @DisplayName("Should return dashboard stats with correct values")
    void testGetDashboardStats() {
        // When
        DashboardStats stats = emissionService.getDashboardStats();

        // Then
        assertNotNull(stats);
        assertEquals(ApiConstants.TOTAL_EMISSIONS_2023, stats.getTotalEmissions());
        assertEquals(ApiConstants.TOP_SECTOR, stats.getTopSector());
        assertEquals(ApiConstants.NET_ZERO_TARGET, stats.getNetZeroTarget());
        assertEquals(ApiConstants.ACTIVE_ALERTS, stats.getActiveAlerts());
    }

    @Test
    @DisplayName("Should return sector data with correct count")
    void testGetSectorData() {
        // When
        List<SectorData> sectors = emissionService.getSectorData();

        // Then
        assertNotNull(sectors);
        assertEquals(5, sectors.size());
    }

    @Test
    @DisplayName("Should return sector data with correct 2023 values")
    void testGetSectorDataValues() {
        // When
        List<SectorData> sectors = emissionService.getSectorData();

        // Then
        SectorData energySector = sectors.stream()
                .filter(s -> "Energy".equals(s.getName()))
                .findFirst()
                .orElse(null);

        assertNotNull(energySector);
        assertEquals(ApiConstants.ENERGY_2023, energySector.getValue());
        assertEquals("#3b82f6", energySector.getColor());
    }

    @Test
    @DisplayName("Should have consistent data between emissions and sector data")
    void testDataConsistency() {
        // When
        List<Emission> emissions = emissionService.getAllEmissions();
        List<SectorData> sectors = emissionService.getSectorData();
        DashboardStats stats = emissionService.getDashboardStats();

        // Get 2023 emission data
        Emission emission2023 = emissions.stream()
                .filter(e -> "2023".equals(e.getYear()))
                .findFirst()
                .orElse(null);

        // Calculate total from 2023 data
        double calculatedTotal = emission2023.getEnergy() + 
                emission2023.getTransport() + 
                emission2023.getIndustry() + 
                emission2023.getAgriculture() + 
                emission2023.getBuildings();

        // Then
        assertEquals(stats.getTotalEmissions(), calculatedTotal, 0.01, 
                "Total emissions should match sum of 2023 sectors");
        
        // Verify sector values match
        sectors.forEach(sector -> {
            switch (sector.getName()) {
                case "Energy":
                    assertEquals(emission2023.getEnergy(), sector.getValue());
                    break;
                case "Transport":
                    assertEquals(emission2023.getTransport(), sector.getValue());
                    break;
                case "Industry":
                    assertEquals(emission2023.getIndustry(), sector.getValue());
                    break;
                case "Agriculture":
                    assertEquals(emission2023.getAgriculture(), sector.getValue());
                    break;
                case "Buildings":
                    assertEquals(emission2023.getBuildings(), sector.getValue());
                    break;
            }
        });
    }
}

