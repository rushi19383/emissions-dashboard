package com.eco.constants;

/**
 * Constants used across the application
 */
public class ApiConstants {
    
    // API Base Path
    public static final String API_BASE_PATH = "/api/v1";
    
    // Allowed CORS Origins
    public static final String[] ALLOWED_ORIGINS = {
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    };
    
    // Emission Data Constants
    public static final String TOP_SECTOR = "Energy";
    public static final Integer NET_ZERO_TARGET = 2050;
    public static final Integer ACTIVE_ALERTS = 3;
    
    // 2023 Emission Values (MtCO2e)
    public static final Double ENERGY_2023 = 4250.0;
    public static final Double TRANSPORT_2023 = 2600.0;
    public static final Double INDUSTRY_2023 = 2550.0;
    public static final Double AGRICULTURE_2023 = 1650.0;
    public static final Double BUILDINGS_2023 = 840.0;
    
    // Calculate total from constants
    public static final Double TOTAL_EMISSIONS_2023 = 
        ENERGY_2023 + TRANSPORT_2023 + INDUSTRY_2023 + AGRICULTURE_2023 + BUILDINGS_2023;
    
    private ApiConstants() {
        // Utility class - prevent instantiation
    }
}

