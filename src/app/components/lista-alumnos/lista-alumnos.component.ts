import { Component } from '@angular/core';
import { OthersIntDTO } from '../../dtos/other.dto';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VistasService } from '../../services/vistas.service';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActualizarAlumnosComponent } from './actualizar-alumnos/actualizar-alumnos.component';
import { AlumnosDTO } from '../../dtos/alumnos.dto';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrl: './lista-alumnos.component.css'
})
export class ListaAlumnosComponent {
  listaalumnoform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  listadoalumnos: string[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];
  periodoAcademico: PeriodoAcademicoDTO[] = [];

  constructor(
    private router: Router,
    private vistasService: VistasService,
    private modalEditarAlumno: BsModalRef,
    private modalService: BsModalService,
    private periodoaAcademicoService: PeriodoAcademicoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.listaalumnoform = new FormGroup({
      inputEstudiante: new FormControl(''),
      inputNroDocumento: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      selectGradoAcademico: new FormControl(''),
      selectEstadoUsuario: new FormControl(''),
      selectPeriodoAcademico: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.obtenerAlumnos();
    this.periodoaAcademicoService.getPeriodo().subscribe(
      (data: PeriodoAcademicoDTO[]) => {
        this.periodoAcademico = data;
      },
      (error) => {
        console.error("Error al obtener los bimestres:", error);
      }
    );
  }

  AbrirModalEditarAlumno(alumno: ListaAlumnosDTO) {
    const initialState = {
      alumno: alumno // Pasa los datos del alumno seleccionado
    };
    this.modalEditarAlumno = this.modalService.show(ActualizarAlumnosComponent, {
      initialState,
      backdrop: 'static',
      class: 'modal-xl'
    });
    this.modalEditarAlumno.content.alumnoActualizado.subscribe(() => {
      this.obtenerAlumnos(); // Volver a obtener la lista de alumnos
    });
  }

  obtenerAlumnos() {
    this.vistasService.obtenerAlumnos().subscribe(
      (data: ListaAlumnosDTO[]) => {
        if (data.length === 0) {
          console.warn('No se encontraron alumnos registrados.');
          this.alumnos = []; // Asignar lista vacía para actualizar la tabla
        } else {
          this.alumnos = data; // Asigna los datos obtenidos
          this.listadoalumnos = data.map(alumno =>
            `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`
          ); // Llena el arreglo de nombres
        }
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
      }
    );
  }

  obtenerNombrePeriodo(idperiodo: number): string {
    const periodo = this.periodoAcademico.find(p => p.idperiodo === idperiodo);
    return periodo ? periodo.peNombre : 'Período no encontrado';
  }

  RegistrarAlumno() {
    this.router.navigate(['/registro-alumno']).then(() => {
      window.location.reload();
    });
  }

  LimpiarFormulario() {
    this.listaalumnoform.reset();
    this.buscarAlumno = [...this.alumnos];
  }

  EliminarAlumno(alumno: any) {
    const nuevoEstado = !alumno.usEliminado;
    Swal.fire({
      title: '¿Está seguro?',
      text: "El alumno será eliminado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vistasService.cambiarEstadoUsuario(alumno.idusuario, nuevoEstado).subscribe(
          () => {
            alumno.usEliminado = nuevoEstado;
            this.obtenerAlumnos();
            this.MostrarMensajeExito('Alumno eliminado', 'El alumno fue eliminado correctamente');
          },
          (error) => {
            console.error('Error al eliminar el alumno', error);
            this.MostrarMensajeError('Hubo un error al eliminar el alumno', 'Error');
          }
        );
      }
    });
  }

  BuscarAlumno() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }

    const terminobusqueda = this.listaalumnoform.get('inputEstudiante')?.value;
    const nroDocumento = this.listaalumnoform.get('inputNroDocumento')?.value || '';
    const gradoAcademico = this.listaalumnoform.get('selectGradoAcademico')?.value;
    const estadoUsuario = this.listaalumnoform.get('selectEstadoUsuario')?.value;
    const periodoAcademico = this.listaalumnoform.get('selectPeriodoAcademico')?.value;

    this.buscarAlumno = this.alumnos.filter(alumno => {
      const nombreCompleto = `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`.toLowerCase();

      return (
        (terminobusqueda ? nombreCompleto.includes(terminobusqueda.toLowerCase()) : true) &&
        (nroDocumento ? alumno.usDni.includes(nroDocumento) : true) &&
        (gradoAcademico ? alumno.idgrado === gradoAcademico : true) &&
        (periodoAcademico ? alumno.idperiodo === periodoAcademico : true) &&
        (estadoUsuario === true || estadoUsuario === false ? alumno.usEstado === estadoUsuario : true)
      );
    });

    console.log(this.buscarAlumno);
  }

  validarCamposBusqueda(): boolean {
    const terminobusqueda = this.listaalumnoform.get('inputEstudiante')?.value;
    const nroDocumento = this.listaalumnoform.get('inputNroDocumento')?.value;
    const gradoAcademico = this.listaalumnoform.get('selectGradoAcademico')?.value;
    const estadoUsuario = this.listaalumnoform.get('selectEstadoUsuario')?.value;

    return !!(terminobusqueda || nroDocumento || gradoAcademico || estadoUsuario === true || estadoUsuario === false);
  }

  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true
    });
  }

  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }
}
