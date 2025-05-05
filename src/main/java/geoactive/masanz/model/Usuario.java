package geoactive.masanz.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Usuario {
    private String id;
    private String email;
    private String nombre;
    private String apellidos;
    private Rol rol;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private boolean activo;
} 