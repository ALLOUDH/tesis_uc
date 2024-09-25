import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SexoService } from '../../services/sexo.service';
import { OthersDTO, OthersIntDTO } from '../../dtos/other.dto';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { AlumnosDTO } from '../../dtos/alumnos.dto';
import { UserRoleService } from '../../services/user-role.service';
import Swal from 'sweetalert2';
import { AccesoService } from '../../services/acceso.service';



@Component({
  selector: 'app-registro-alumno',
  templateUrl: './registroalumno.component.html',
  styleUrls: ['./registroalumno.component.css'],
})
export class RegistroAlumnoComponent {
  alumnoForm: FormGroup;
  otherSexo: OthersIntDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  otherUserRole: OthersDTO[] = [];
  UserRole: any;

  constructor(
    private AccesoService: AccesoService,
    sexoUsuarioService: SexoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
    userRoleService: UserRoleService,
  ) {
    this.UserRole = userRoleService.ObtenerUserRole();
    this.otherSexo = sexoUsuarioService.ObtenerSexo();
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    // Inicialización del FormGroup con validaciones
    this.alumnoForm = new FormGroup({
      inputDNI: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]), // Solo números
      inputApellidoPaterno: new FormControl('', Validators.required),
      inputPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]), // Letras mayúsculas, minúsculas, números y caracteres especiales
      inputEmail: new FormControl('', [Validators.required, Validators.email]),
      selectSexo: new FormControl('', Validators.required),
      selectEstadoUsuario: new FormControl('', Validators.required),
      selectGradoAcademico: new FormControl('', Validators.required),
      inputCelular: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
      inputInstitucionProcedencia: new FormControl('', Validators.required),
      inputNombreAlumno: new FormControl('', Validators.required),
      inputApellidoMaterno: new FormControl('', Validators.required),
      inputConfirmPassword: new FormControl('', [Validators.required]),
      inputCodigoAlumno: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator as ValidatorFn });
  }



  //Metodo para validación de que la contraseña ingresada es igual al de confirmar contraseña
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('inputPassword')?.value;
    const confirmPassword = group.get('inputConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Método para verificar si hay un error de coincidencia de contraseñas
  get passwordMismatch() {
    return this.alumnoForm.hasError('mismatch') && this.alumnoForm.get('inputConfirmPassword')?.touched;
  }

  // Propiedad que permite obtener los controles del formulario de alumnos
  get Controls() {
    return this.alumnoForm?.controls;
  }

  //Funcion para limpiar datos del form
  limpiarFormulario() {
    this.alumnoForm.reset();
  }

  AsignarAlumno(alumno: AlumnosDTO) {
    this.AsignarValoresAControles(alumno);
  }

  AsignarValoresAControles(alumno: AlumnosDTO){
    const rolEstudiante = this.UserRole.find((rol: any) => rol.id === 'Estudiante');

    this.alumnoForm.get('UsRol')?.setValue(rolEstudiante.id);
    this.alumnoForm.get('inputDNI')?.setValue(alumno.UsDni);
    this.alumnoForm.get('inputApellidoPaterno')?.setValue(alumno.UsApellidoPaterno);
    this.alumnoForm.get('inputPassword')?.setValue(alumno.UsContrasena);
    this.alumnoForm.get('inputEmail')?.setValue(alumno.UsEmail);
    this.alumnoForm.get('selectSexo')?.setValue(alumno.UsSexo);
    this.alumnoForm.get('selectEstadoUsuario')?.setValue(alumno.UsEstado);
    this.alumnoForm.get('selectGradoAcademico')?.setValue(alumno.Idgrado);
    this.alumnoForm.get('inputCelular')?.setValue(alumno.UsCelular);
    this.alumnoForm.get('inputInstitutcionProcedencia')?.setValue(alumno.AlInstitucion);
    this.alumnoForm.get('inputNombreAlumno')?.setValue(alumno.UsNombre);
    this.alumnoForm.get('inputApellidoMaterno')?.setValue(alumno.UsApellidoMaterno);
    this.alumnoForm.get('inputCodigoAlumno')?.setValue(alumno.AlCodigoAlumno);
  }

  RegistrarAlumno() {
    for (let i in this.alumnoForm.controls) {
        this.alumnoForm.controls[i].markAsTouched();
    }
    if (this.alumnoForm.valid) {
        let alumno = new AlumnosDTO();
        const rolEstudiante = this.UserRole.find((rol: any) => rol.id === 'Estudiante');
        alumno.UsRol = rolEstudiante ? rolEstudiante.id : null; // Manejo de rol

        alumno.UsDni = this.alumnoForm.controls['inputDNI'].value;
        alumno.UsApellidoPaterno = this.alumnoForm.controls['inputApellidoPaterno'].value;
        alumno.UsContrasena = this.alumnoForm.controls['inputPassword'].value;
        alumno.UsEmail = this.alumnoForm.controls['inputEmail'].value;
        alumno.UsSexo = this.alumnoForm.controls['selectSexo'].value;
        alumno.UsEstado = this.alumnoForm.controls['selectEstadoUsuario'].value;
        alumno.Idgrado = this.alumnoForm.controls['selectGradoAcademico'].value;
        alumno.UsCelular = this.alumnoForm.controls['inputCelular'].value;
        alumno.AlInstitucion = this.alumnoForm.controls['inputInstitucionProcedencia'].value;
        alumno.UsNombre = this.alumnoForm.controls['inputNombreAlumno'].value;
        alumno.UsApellidoMaterno = this.alumnoForm.controls['inputApellidoMaterno'].value;
        alumno.AlCodigoAlumno = this.alumnoForm.controls['inputCodigoAlumno'].value;
        console.log(alumno);

        this.AccesoService.registrarAlumno(alumno).subscribe(
            (response: any) => {
                if (response.isSuccess) {
                    this.MostrarMensajeExito("Registro exitoso", "El alumno ha sido registrado correctamente");
                    this.LimpiarFormulario();
                } else {
                    this.MostrarMensajeError("Registro Fallido", "Oops! Algo salió mal");
                }
            },
            (error) => {
                console.error('Error en el servidor:', error);
                this.MostrarMensajeError('Error', 'Ocurrió un error en el servidor');
            }
        );
    } else {
        this.MostrarMensajeError("Por favor, complete los campos obligatorios", "Oops! Algo salió mal");
    }
}

  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 1800,
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

  LimpiarFormulario() {
    this.alumnoForm.reset();
  }

}
