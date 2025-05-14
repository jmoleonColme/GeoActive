package geoactive.masanz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import geoactive.masanz.model.Activo;
import geoactive.masanz.service.ActivoService;
import geoactive.masanz.service.AuthService;
import geoactive.masanz.model.Usuario;

import java.util.List;

@RestController
@RequestMapping("/api/activos")
@CrossOrigin(origins = "*")
public class ActivoController {

    @Autowired
    private ActivoService activoService;

    @Autowired
    private AuthService authService;

    private Usuario verificarAutenticacion(String token) throws Exception {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token no válido");
        }
        Usuario usuario = authService.verificarToken(token.substring(7));
        if (usuario == null) {
            throw new RuntimeException("Usuario no autenticado");
        }
        return usuario;
    }

    @GetMapping
    public ResponseEntity<List<Activo>> listarActivos(
            @RequestHeader("Authorization") String token) throws Exception {
        Usuario usuario = verificarAutenticacion(token);
        if (!authService.tienePermiso(usuario, "ver")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(activoService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activo> obtenerActivo(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) throws Exception {
        Usuario usuario = verificarAutenticacion(token);
        if (!authService.tienePermiso(usuario, "ver")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Activo activo = activoService.obtenerActivo(id);
        return activo != null ? ResponseEntity.ok(activo) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<String> crearActivo(
            @RequestBody Activo activo,
            @RequestHeader("Authorization") String token) throws Exception {
        Usuario usuario = verificarAutenticacion(token);
        if (!authService.tienePermiso(usuario, "crear")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        activo.setCreadoPor(usuario.getId());
        String id = activoService.crearActivo(activo);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizarActivo(
            @PathVariable String id,
            @RequestBody Activo activo,
            @RequestHeader("Authorization") String token) throws Exception {
        Usuario usuario = verificarAutenticacion(token);
        if (!authService.tienePermiso(usuario, "actualizar")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!activoService.existeActivo(id)) {
            return ResponseEntity.notFound().build();
        }
        activo.setId(id);
        activoService.actualizarActivo(id, activo);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarActivo(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) throws Exception {
        Usuario usuario = verificarAutenticacion(token);
        if (!authService.tienePermiso(usuario, "eliminar")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!activoService.existeActivo(id)) {
            return ResponseEntity.notFound().build();
        }
        activoService.eliminarActivo(id);
        return ResponseEntity.ok().build();
    }
}