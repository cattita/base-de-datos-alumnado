class Alumno {
  constructor(nombre, apellidos, edad) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.edad = edad;
    this.materias = [];
    this.calificaciones = {};
  }

  inscribirMateria(materia) {
    if (!this.materias.includes(materia)) {
      this.materias.push(materia);
      this.calificaciones[materia] = null;
    }
  }

  asignarCalificacion(materia, nota) {
    this.inscribirMateria(materia);
    this.calificaciones[materia] = parseFloat(nota);
  }

  obtenerPromedio() {
    const notas = Object.values(this.calificaciones).filter(n => n !== null);
    if (notas.length === 0) return 0;
    return notas.reduce((a, b) => a + b, 0) / notas.length;
  }
}

class Grupo {
  constructor(nombre) {
    this.nombre = nombre;
    this.alumnos = [];
  }

  agregarAlumno(alumno) {
    // Verificar si el alumno ya está en el grupo
    const existe = this.alumnos.some(a => a === alumno);
    if (!existe) {
      this.alumnos.push(alumno);
    } else {
      alert(`El alumno ${alumno.nombre} ${alumno.apellidos} ya está en el grupo ${this.nombre}.`);
    }
  }

  obtenerPromedioGrupo() {
    if (this.alumnos.length === 0) return 0;
    return this.alumnos.reduce((sum, a) => sum + a.obtenerPromedio(), 0) / this.alumnos.length;
  }

  ordenarPorCalificacion(desc = false) {
    return [...this.alumnos].sort((a, b) =>
      desc ? b.obtenerPromedio() - a.obtenerPromedio() : a.obtenerPromedio() - b.obtenerPromedio()
    );
  }

  buscarPorNombre(nombre) {
    return this.alumnos.filter(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  }

  buscarPorApellido(apellido) {
    return this.alumnos.filter(a => a.apellidos.toLowerCase() === apellido.toLowerCase());
  }

  buscarPorEdad(edad) {
    return this.alumnos.filter(a => a.edad === edad);
  }
}

const alumnos = [];
const grupos = [];

document.getElementById('formAlumno').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const edad = parseInt(document.getElementById('edad').value);

  if (!nombre || !apellidos || isNaN(edad)) {
    alert('Por favor, completa todos los campos de alumno correctamente.');
    return;
  }

  const nuevo = new Alumno(nombre, apellidos, edad);
  alumnos.push(nuevo);

  mostrarAlumnos();
  actualizarSelects();

  e.target.reset();
});

document.getElementById('formMateria').addEventListener('submit', e => {
  e.preventDefault();

  const alumnoSelect = document.getElementById('alumnoMateria');
  const index = parseInt(alumnoSelect.value);
  const materiaInput = document.getElementById('materia');
  const materia = materiaInput.value.trim();

  if (isNaN(index)) {
    alert('Por favor, selecciona un alumno.');
    return;
  }

  if (!materia) {
    alert('Por favor, ingresa una materia.');
    return;
  }

  alumnos[index].inscribirMateria(materia);

  mostrarAlumnos();
  actualizarSelectMaterias();

  materiaInput.value = '';
});

document.getElementById('formNota').addEventListener('submit', e => {
  e.preventDefault();
  const index = parseInt(document.getElementById('alumnoNota').value);
  const materia = document.getElementById('materiaNota').value;
  const nota = parseFloat(document.getElementById('nota').value);

  if (isNaN(index) || !materia || isNaN(nota)) {
    alert('Por favor, completa todos los campos para asignar nota.');
    return;
  }

  if (nota < 1 || nota > 7) {
    alert('La nota debe estar entre 1 y 7.');
    return;
  }

  alumnos[index].asignarCalificacion(materia, nota);

  mostrarAlumnos();

  e.target.reset();
});

document.getElementById('formGrupo').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombreGrupo').value.trim();
  if (!nombre) {
    alert('Por favor, ingresa un nombre de grupo.');
    return;
  }

  const nuevoGrupo = new Grupo(nombre);
  grupos.push(nuevoGrupo);

  actualizarSelectGrupos();
  mostrarGrupos();

  e.target.reset();
});

document.getElementById('btnAsignarAGrupo').addEventListener('click', () => {
  const grupoIndex = parseInt(document.getElementById('selectGrupo').value);
  const alumnoIndex = parseInt(document.getElementById('selectAlumnoGrupo').value);

  if (isNaN(grupoIndex) || isNaN(alumnoIndex)) {
    alert('Por favor, selecciona grupo y alumno para asignar.');
    return;
  }

  grupos[grupoIndex].agregarAlumno(alumnos[alumnoIndex]);
  mostrarGrupos();
});

function actualizarSelects() {
  const alumnoSelects = ['alumnoMateria', 'alumnoNota', 'selectAlumnoGrupo'];
  alumnoSelects.forEach(id => {
    const select = document.getElementById(id);
    select.innerHTML = '';
    alumnos.forEach((a, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${a.nombre} ${a.apellidos}`;
      select.appendChild(opt);
    });
  });
  actualizarSelectMaterias();
}

function actualizarSelectMaterias() {
  const index = parseInt(document.getElementById('alumnoNota').value);
  const materiaSelect = document.getElementById('materiaNota');
  materiaSelect.innerHTML = '';

  if (!isNaN(index)) {
    alumnos[index].materias.forEach(materia => {
      const opt = document.createElement('option');
      opt.value = materia;
      opt.textContent = materia;
      materiaSelect.appendChild(opt);
    });
  }
}

document.getElementById('alumnoNota').addEventListener('change', actualizarSelectMaterias);

// Función buscar con soporte Enter y botón
function buscar() {
  const query = document.getElementById('busqueda').value.trim().toLowerCase();

  if (!query) {
    document.getElementById('resultadoBusqueda').innerHTML = '';
    mostrarAlumnos();
    return;
  }

  const resultados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(query) ||
    a.apellidos.toLowerCase().includes(query) ||
    a.edad.toString() === query
  );
  mostrarResultados(resultados);
}

document.getElementById('busqueda').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    buscar();
  }
});

function mostrarAlumnos() {
  const lista = document.getElementById('listaAlumnos');
  lista.innerHTML = '';
  alumnos.forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.nombre} ${a.apellidos} - Edad: ${a.edad} - Promedio: ${a.obtenerPromedio().toFixed(2)}`;
    lista.appendChild(li);
  });
}

function actualizarSelectGrupos() {
  const select = document.getElementById('selectGrupo');
  select.innerHTML = '';
  grupos.forEach((g, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = g.nombre;
    select.appendChild(opt);
  });
}

function mostrarGrupos() {
  const ul = document.getElementById('gruposInfo');
  ul.innerHTML = '';
  grupos.forEach(grupo => {
    const li = document.createElement('li');
    li.textContent = `${grupo.nombre} (${grupo.alumnos.length} alumnos) - Promedio: ${grupo.obtenerPromedioGrupo().toFixed(2)}`;
    ul.appendChild(li);
  });
}

function ordenar(asc = true) {
  const ordenados = [...alumnos].sort((a, b) =>
    asc ? a.obtenerPromedio() - b.obtenerPromedio() : b.obtenerPromedio() - a.obtenerPromedio()
  );
  mostrarResultados(ordenados);
}

function mostrarResultados(lista) {
  const ul = document.getElementById('resultadoBusqueda');
  ul.innerHTML = '';
  lista.forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.nombre} ${a.apellidos} - Edad: ${a.edad} - Promedio: ${a.obtenerPromedio().toFixed(2)}`;
    ul.appendChild(li);
  });
}
