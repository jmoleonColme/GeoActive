// Funciones para manejar los activos
    const API_BASE_URL = '/api/activos';

    // Función para obtener el header de autorización
    function getAuthHeader() {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Función para mostrar los activos en la tabla
    function mostrarActivos(activos) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Activos</h2>
                <button class="btn btn-primary" onclick="mostrarFormularioCrear()">
                    <i class="fas fa-plus"></i> Nuevo Activo
                </button>
            </div>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Ubicación</th>
                            <th>Valor</th>
                            <th>Asignado a</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activos && activos.length > 0 ? activos.map(activo => `
                            <tr>
                                <td>${activo.id}</td>
                                <td>${activo.nombre}</td>
                                <td>${activo.categoria}</td>
                                <td>${activo.estado}</td>
                                <td>${activo.ubicacion}</td>
                                <td>${activo.valor ? activo.valor.toFixed(2) + ' €' : '-'}</td>
                                <td>${activo.asignadoA || '-'}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="mostrarFormularioEditar('${activo.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarActivo('${activo.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : '<tr><td colspan="8" class="text-center">No hay activos disponibles</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Función para mostrar el formulario de creación
    function mostrarFormularioCrear() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Nuevo Activo</h3>
                </div>
                <div class="card-body">
                    <form id="activoForm" onsubmit="crearActivo(event)">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="nombre" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombre" required>
                                </div>
                                <div class="mb-3">
                                    <label for="descripcion" class="form-label">Descripción</label>
                                    <textarea class="form-control" id="descripcion" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="categoria" class="form-label">Categoría</label>
                                    <input type="text" class="form-control" id="categoria" required>
                                </div>
                                <div class="mb-3">
                                    <label for="estado" class="form-label">Estado</label>
                                    <select class="form-control" id="estado" required>
                                        <option value="ACTIVO">Activo</option>
                                        <option value="INACTIVO">Inactivo</option>
                                        <option value="MANTENIMIENTO">En Mantenimiento</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="ubicacion" class="form-label">Ubicación</label>
                                    <input type="text" class="form-control" id="ubicacion" required>
                                </div>
                                <div class="mb-3">
                                    <label for="valor" class="form-label">Valor</label>
                                    <input type="number" step="0.01" class="form-control" id="valor" required>
                                </div>
                                <div class="mb-3">
                                    <label for="fechaCompra" class="form-label">Fecha de Compra</label>
                                    <input type="date" class="form-control" id="fechaCompra" required>
                                </div>
                                <div class="mb-3">
                                    <label for="asignadoA" class="form-label">Asignado a</label>
                                    <input type="text" class="form-control" id="asignadoA">
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-3">
                            <button type="button" class="btn btn-secondary" onclick="listarActivos()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Función para mostrar el formulario de edición
    async function mostrarFormularioEditar(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('Error al obtener el activo');
            const activo = await response.json();
            
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3>Editar Activo</h3>
                    </div>
                    <div class="card-body">
                        <form id="activoForm" onsubmit="actualizarActivo(event, '${id}')">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nombre" class="form-label">Nombre</label>
                                        <input type="text" class="form-control" id="nombre" value="${activo.nombre}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="descripcion" class="form-label">Descripción</label>
                                        <textarea class="form-control" id="descripcion" required>${activo.descripcion}</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="categoria" class="form-label">Categoría</label>
                                        <input type="text" class="form-control" id="categoria" value="${activo.categoria}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="estado" class="form-label">Estado</label>
                                        <select class="form-control" id="estado" required>
                                            <option value="ACTIVO" ${activo.estado === 'ACTIVO' ? 'selected' : ''}>Activo</option>
                                            <option value="INACTIVO" ${activo.estado === 'INACTIVO' ? 'selected' : ''}>Inactivo</option>
                                            <option value="MANTENIMIENTO" ${activo.estado === 'MANTENIMIENTO' ? 'selected' : ''}>En Mantenimiento</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="ubicacion" class="form-label">Ubicación</label>
                                        <input type="text" class="form-control" id="ubicacion" value="${activo.ubicacion}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="valor" class="form-label">Valor</label>
                                        <input type="number" step="0.01" class="form-control" id="valor" value="${activo.valor}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="fechaCompra" class="form-label">Fecha de Compra</label>
                                        <input type="date" class="form-control" id="fechaCompra" value="${activo.fechaCompra ? activo.fechaCompra.split('T')[0] : ''}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="asignadoA" class="form-label">Asignado a</label>
                                        <input type="text" class="form-control" id="asignadoA" value="${activo.asignadoA || ''}">
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mt-3">
                                <button type="button" class="btn btn-secondary" onclick="listarActivos()">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar el activo');
        }
    }

    // Listar activos
    async function listarActivos() {
        try {
            const response = await fetch(API_BASE_URL, {
                headers: getAuthHeader()
            });
            if (!response.ok) {
                throw new Error(`Error al obtener activos: ${response.statusText}`);
            }
            const activos = await response.json();
            mostrarActivos(activos);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los activos. Por favor, intente nuevamente.');
        }
    }

    // Crear activo
    async function crearActivo(event) {
        event.preventDefault();
        const activo = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            categoria: document.getElementById('categoria').value,
            estado: document.getElementById('estado').value,
            ubicacion: document.getElementById('ubicacion').value,
            valor: parseFloat(document.getElementById('valor').value),
            fechaCompra: document.getElementById('fechaCompra').value,
            asignadoA: document.getElementById('asignadoA').value
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(activo)
            });
            if (!response.ok) throw new Error('Error al crear activo');
            alert('Activo creado correctamente');
            listarActivos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear el activo');
        }
    }

    // Actualizar activo
    async function actualizarActivo(event, id) {
        event.preventDefault();
        const activo = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            categoria: document.getElementById('categoria').value,
            estado: document.getElementById('estado').value,
            ubicacion: document.getElementById('ubicacion').value,
            valor: parseFloat(document.getElementById('valor').value),
            fechaCompra: document.getElementById('fechaCompra').value,
            asignadoA: document.getElementById('asignadoA').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(activo)
            });
            if (!response.ok) throw new Error('Error al actualizar activo');
            alert('Activo actualizado correctamente');
            listarActivos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el activo');
        }
    }

    // Eliminar activo
    async function eliminarActivo(id) {
        if (!confirm('¿Está seguro de eliminar este activo?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('Error al eliminar activo');
            alert('Activo eliminado correctamente');
            listarActivos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el activo');
        }
    }

    // Función para mostrar el dashboard
    function mostrarDashboard() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Dashboard</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card text-white bg-primary mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">Total Activos</h5>
                                    <p class="card-text" id="totalActivos">Cargando...</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-white bg-success mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">Activos Activos</h5>
                                    <p class="card-text" id="activosActivos">Cargando...</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-white bg-warning mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">En Mantenimiento</h5>
                                    <p class="card-text" id="enMantenimiento">Cargando...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        actualizarEstadisticas();
    }

    // Función para actualizar estadísticas
    async function actualizarEstadisticas() {
        try {
            const response = await fetch(API_BASE_URL, {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('Error al obtener estadísticas');
            const activos = await response.json();
            
            const totalActivos = activos.length;
            const activosActivos = activos.filter(a => a.estado === 'ACTIVO').length;
            const enMantenimiento = activos.filter(a => a.estado === 'MANTENIMIENTO').length;
            
            document.getElementById('totalActivos').textContent = totalActivos;
            document.getElementById('activosActivos').textContent = activosActivos;
            document.getElementById('enMantenimiento').textContent = enMantenimiento;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('totalActivos').textContent = 'Error';
            document.getElementById('activosActivos').textContent = 'Error';
            document.getElementById('enMantenimiento').textContent = 'Error';
        }
    }

    // Función para mostrar reportes
    function mostrarReportes() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Reportes</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">Activos por Categoría</h5>
                                    <canvas id="categoriaChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">Activos por Estado</h5>
                                    <canvas id="estadoChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cargarReportes();
    }

    // Función para cargar los reportes
    async function cargarReportes() {
        try {
            const response = await fetch(API_BASE_URL, {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('Error al obtener datos para reportes');
            const activos = await response.json();
            
            // Preparar datos para gráficos
            const categorias = {};
            const estados = {};
            
            activos.forEach(activo => {
                categorias[activo.categoria] = (categorias[activo.categoria] || 0) + 1;
                estados[activo.estado] = (estados[activo.estado] || 0) + 1;
            });
            
            // Crear gráfico de categorías
            new Chart(document.getElementById('categoriaChart'), {
                type: 'pie',
                data: {
                    labels: Object.keys(categorias),
                    datasets: [{
                        data: Object.values(categorias),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                    }]
                }
            });
            
            // Crear gráfico de estados
            new Chart(document.getElementById('estadoChart'), {
                type: 'bar',
                data: {
                    labels: Object.keys(estados),
                    datasets: [{
                        label: 'Cantidad',
                        data: Object.values(estados),
                        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los reportes');
        }
    }

    // Configurar navegación
    document.addEventListener('DOMContentLoaded', () => {
        // Configurar enlaces de navegación
        document.getElementById('dashboardLink').addEventListener('click', (e) => {
            e.preventDefault();
            mostrarDashboard();
        });
        
        document.getElementById('assetsLink').addEventListener('click', (e) => {
            e.preventDefault();
            listarActivos();
        });
        
        document.getElementById('reportsLink').addEventListener('click', (e) => {
            e.preventDefault();
            mostrarReportes();
        });
        
        // Verificar si el usuario está autenticado
        if (isAuthenticated()) {
            mostrarDashboard(); // Mostrar dashboard por defecto
        }
    });