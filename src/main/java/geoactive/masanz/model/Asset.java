package geoactive.masanz.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Asset {
    private String id;
    private String name;
    private String description;
    private String category;
    private String status;
    private String location;
    private double value;
    private LocalDateTime purchaseDate;
    private LocalDateTime lastMaintenanceDate;
    private String assignedTo;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 