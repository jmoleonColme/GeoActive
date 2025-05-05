package geoactive.masanz.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;
import geoactive.masanz.model.Usuario;
import geoactive.masanz.model.Rol;

@Service
public class AuthService {

    public Usuario verificarToken(String token) throws Exception {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        // Por ahora asignamos ADMINISTRADOR para pruebas
        Usuario usuario = new Usuario();
        usuario.setId(decodedToken.getUid());
        usuario.setEmail(decodedToken.getEmail());
        usuario.setRol(Rol.ADMINISTRADOR); // Cambiado a ADMINISTRADOR para pruebas
        return usuario;
    }

    public boolean tienePermiso(Usuario usuario, String accion) {
        switch (usuario.getRol()) {
            case ADMINISTRADOR:
                return true;
            case EMPLEADO:
                return accion.equals("ver") || accion.equals("actualizar");
            case REVISOR:
                return accion.equals("ver");
            default:
                return false;
        }
    }
} 