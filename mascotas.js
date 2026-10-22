let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];

const listadoMascotas = document.getElementById('listado-mascotas');
const total = document.getElementById('total');
const formulario = document.getElementById('form-mascota');
const idMascotaInput = document.getElementById('idMascota');
const botonAgregarMascota = document.getElementById('botonAgregarMascota');

// Función para cargar los datos al entrar en la web
function render() {
    
    listadoMascotas.innerHTML = '';

    if (mascotas.length === 0) {
        listadoMascotas.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-3">No hay mascotas registradas.</td>
            </tr>
        `;
        total.textContent = 0;
        return;
    }

    mascotas.forEach((mascota) => {
        listadoMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreDuenio}</td>
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.color}</td>
                <td>${mascota.edad}</td>
                <td>${mascota.peso}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-warning me-1" onclick="cargarParaEditar('${mascota.idMascota}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarMascota('${mascota.idMascota}')">Eliminar</button>
                </td>
            </tr>
        `;
    });

    total.textContent = mascotas.length;
}


render();

function guardarEnLocalStorage() {
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);
    const idExistente = idMascotaInput.value;

    if (idExistente) {
        // Modo Edición: buscamos la mascota y actualizamos sus propiedades
        mascotas = mascotas.map((mascota) => {
            if (mascota.idMascota === idExistente) {
                return {
                    idMascota: idExistente,
                    nombreDuenio: datos.get('nombreDuenio').trim(),
                    nombreMascota: datos.get('nombreMascota').trim(),
                    color: datos.get('color').trim(),
                    edad: Number(datos.get('edad')),
                    peso: parseFloat(datos.get('peso'))
                };
            }
            return mascota;
        });

        
        botonAgregarMascota.textContent = 'Agregar Mascota';
    } else {
        
        const nuevaMascota = {
            idMascota: crypto.randomUUID(),
            nombreDuenio: datos.get('nombreDuenio').trim(),
            nombreMascota: datos.get('nombreMascota').trim(),
            color: datos.get('color').trim(),
            edad: Number(datos.get('edad')),
            peso: parseFloat(datos.get('peso'))
        };
        mascotas.push(nuevaMascota);
    }

    guardarEnLocalStorage();
    render();
    formulario.reset();
    idMascotaInput.value = ''; 
});


window.cargarParaEditar = function(id) {
    const mascotaAEditar = mascotas.find((m) => m.idMascota === id);
    if (!mascotaAEditar) return;

    // Rellenar el formulario con los datos de la mascota
    idMascotaInput.value = mascotaAEditar.idMascota;
    document.getElementById('nombreDuenio').value = mascotaAEditar.nombreDuenio;
    document.getElementById('nombreMascota').value = mascotaAEditar.nombreMascota;
    document.getElementById('color').value = mascotaAEditar.color;
    document.getElementById('edad').value = mascotaAEditar.edad;
    document.getElementById('peso').value = mascotaAEditar.peso;

    
    botonAgregarMascota.textContent = 'Modificar Mascota';
}


window.eliminarMascota = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
        mascotas = mascotas.filter((m) => m.idMascota !== id);
        guardarEnLocalStorage();
        render();

        
        if (idMascotaInput.value === id) {
            formulario.reset();
            idMascotaInput.value = '';
            botonAgregarMascota.textContent = 'Agregar Mascota';
        }
    }
}