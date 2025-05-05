package geoactive.masanz.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Activo {
    private String id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private String estado;
    private String ubicacion;
    private double valor;
    private LocalDateTime fechaCompra;
    private LocalDateTime fechaUltimoMantenimiento;
    private String asignadoA;
    private String creadoPor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
} 