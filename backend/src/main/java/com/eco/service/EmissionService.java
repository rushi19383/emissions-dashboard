package com.eco.service;

import com.eco.constants.ApiConstants;
import com.eco.model.DashboardStats;
import com.eco.model.Emission;
import com.eco.model.SectorData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Service class for handling emission data business logic
 * Currently uses hardcoded data (no database)
 */
@Service
public class EmissionService {

    private static final Logger logger = LoggerFactory.getLogger(EmissionService.class);

    /**
     * Retrieves all historical emission data
     * @return List of Emission objects from 2019 to 2023
     */
    public List<Emission> getAllEmissions() {
        logger.debug("Retrieving all emissions data");
        List<Emission> list = new ArrayList<>();
        list.add(new Emission(1L, "2019", 4000.0, 2400.0, 2400.0, 1500.0, 800.0));
        list.add(new Emission(2L, "2020", 3800.0, 2000.0, 2200.0, 1550.0, 780.0));
        list.add(new Emission(3L, "2021", 4100.0, 2300.0, 2500.0, 1600.0, 820.0));
        list.add(new Emission(4L, "2022", 4300.0, 2500.0, 2600.0, 1620.0, 850.0));
        list.add(new Emission(5L, "2023", ApiConstants.ENERGY_2023, ApiConstants.TRANSPORT_2023, 
                ApiConstants.INDUSTRY_2023, ApiConstants.AGRICULTURE_2023, ApiConstants.BUILDINGS_2023));
        logger.debug("Returning {} emission records", list.size());
        return list;
    }

    /**
     * Gets dashboard statistics for the summary cards
     * @return DashboardStats object with total emissions, top sector, net zero target, and alerts
     */
    public DashboardStats getDashboardStats() {
        logger.debug("Calculating dashboard statistics");
        return new DashboardStats(
                ApiConstants.TOTAL_EMISSIONS_2023, // Total Emissions in MtCO2e (calculated from 2023 data)
                ApiConstants.TOP_SECTOR, // Top Sector (Energy has highest value)
                ApiConstants.NET_ZERO_TARGET, // Net Zero Target Year
                ApiConstants.ACTIVE_ALERTS // Active Alerts
        );
    }

    /**
     * Gets sector data for pie chart visualization
     * Based on 2023 emission data
     * @return List of SectorData objects with name, value, and color
     */
    public List<SectorData> getSectorData() {
        logger.debug("Retrieving sector data for visualization");
        return Arrays.asList(
                new SectorData("Energy", ApiConstants.ENERGY_2023, "#3b82f6"),
                new SectorData("Transport", ApiConstants.TRANSPORT_2023, "#f59e0b"),
                new SectorData("Industry", ApiConstants.INDUSTRY_2023, "#10b981"),
                new SectorData("Agriculture", ApiConstants.AGRICULTURE_2023, "#8b5cf6"),
                new SectorData("Buildings", ApiConstants.BUILDINGS_2023, "#ef4444"));
    }
}