package com.eco.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private Double totalEmissions;
    private String topSector;
    private Integer netZeroTarget;
    private Integer activeAlerts;
}

