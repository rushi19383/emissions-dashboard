package com.eco.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Emission {
    private Long id;
    private String year;
    private Double energy;
    private Double transport;
    private Double industry;
    private Double agriculture;
    private Double buildings;
}