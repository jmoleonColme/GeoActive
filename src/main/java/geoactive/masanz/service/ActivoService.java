package geoactive.masanz.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.stereotype.Service;
import geoactive.masanz.model.Activo;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.time.LocalDateTime;

@Service
public class ActivoService {
    private static final String COLLECTION_NAME = "activos";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public String crearActivo(Activo activo) throws ExecutionException, InterruptedException {
        activo.setFechaCreacion(LocalDateTime.now());
        activo.setFechaActualizacion(LocalDateTime.now());
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document();
        activo.setId(docRef.getId());
        ApiFuture<WriteResult> result = docRef.set(activo);
        result.get(); // Esperar a que se complete la operación
        return activo.getId();
    }

    public Activo obtenerActivo(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(Activo.class);
        }
        return null;
    }

    public List<Activo> listarActivos() throws ExecutionException, InterruptedException {
        List<Activo> activos = new ArrayList<>();
        ApiFuture<com.google.cloud.firestore.QuerySnapshot> future = getFirestore().collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            activos.add(document.toObject(Activo.class));
        }
        return activos;
    }

    public void actualizarActivo(String id, Activo activo) throws ExecutionException, InterruptedException {
        activo.setFechaActualizacion(LocalDateTime.now());
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(id);
        ApiFuture<WriteResult> result = docRef.set(activo);
        result.get();
    }

    public void eliminarActivo(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(id);
        ApiFuture<WriteResult> result = docRef.delete();
        result.get();
    }

    public boolean existeActivo(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getFirestore().collection(COLLECTION_NAME).document(id);
        return docRef.get().get().exists();
    }
}