import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "../auth/login/login.component";
import { NotFoundComponentComponent } from "../handle-errors/not-found-component/not-found-component.component";
import { RegistroAlumnoComponent } from "../components/registro-alumno/registroalumno.component";
import { RegistrodocenteComponent } from "../components/registrodocente/registrodocente.component";
import { AuthGuard } from "../guards/auth.guard";
import { RegistroComentarioComponent } from "../components/registro-comentario/registro-comentario.component";
import { RegistroIncidenciasComponent } from "../components/registro-incidencias/registro-incidencias.component";
import { PeriodoAcademicoComponent } from "../components/periodo-academico/periodo-academico.component";
import { ListaUnidadesAcademicasComponent } from "../components/lista-unidades-academicas/lista-unidades-academicas.component";
import { ListaBimestresAcademicosComponent } from "../components/lista-bimestres-academicos/lista-bimestres-academicos.component";
import { ListaAreaCursosComponent } from "../components/lista-area-cursos/lista-area-cursos.component";
import { ListaAsignaturasComponent } from "../components/lista-asignaturas/lista-asignaturas.component";
import { ListaCategoriaNotasComponent } from "../components/lista-categoria-notas/lista-categoria-notas.component";
import { ListaTiposNotasComponent } from "../components/lista-tipos-notas/lista-tipos-notas.component";
import { ListaAlumnosComponent } from "../components/lista-alumnos/lista-alumnos.component";
import { ListaDocentesComponent } from "../components/lista-docentes/lista-docentes.component";
import { AdministracionNotasRegistroAuxiliarComponent } from "../components/administracion-notas-registro-auxiliar/administracion-notas-registro-auxiliar.component";
import { AdministracionNotasConductaComponent } from "../components/administracion-notas-conducta/administracion-notas-conducta.component";
import { AdministracionNotasPadreComponent } from "../components/administracion-notas-padre/administracion-notas-padre.component";
import { EditarAsistenciaComponent } from "../components/editar-asistencia/editar-asistencia.component";
import { VerFaltasTardanzasComponent } from "../components/ver-faltas-tardanzas/ver-faltas-tardanzas.component";
import { AsignardocentesComponent } from "../components/asignardocentes/asignardocentes.component";
import { RegistroNotasPadreComponent } from "../components/administracion-notas-padre/registro-notas-padre/registro-notas-padre.component";
import { ListanotascomportamientoComponent } from "../components/listanotascomportamiento/listanotascomportamiento.component";
import { RegistrarAsistenciaComponent } from "../components/registrar-asistencia/registrar-asistencia.component";
import { RegistroNotasComportamientoComponent } from "../components/administracion-notas-conducta/registro-notas-conducta/registro-notas-conducta.component";
import { VerNotaComportamientoAlumnoComponent } from "../components/ver-nota-comportamiento-alumno/ver-nota-comportamiento-alumno.component";

const routes: Routes = [
    {
        path: '', redirectTo:'login', pathMatch:'full'
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '', component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            {path:'dashboard', component:DashboardComponent},
            { path: 'registro-alumno', component: RegistroAlumnoComponent },
            { path: 'registro-docente', component: RegistrodocenteComponent },
            { path: 'lista-alumnos', component: ListaAlumnosComponent },
            { path: 'lista-docentes', component: ListaDocentesComponent },
            { path: 'administracion-notas-registro-auxiliar', component: AdministracionNotasRegistroAuxiliarComponent },
            { path: 'administracion-notas-conducta', component: AdministracionNotasConductaComponent },
            { path: 'administracion-notas-padre', component: AdministracionNotasPadreComponent },
            { path: 'editar-asistencia', component: EditarAsistenciaComponent },
            { path: 'ver-faltas-tardanzas', component: VerFaltasTardanzasComponent },
            { path: 'periodo-academico', component: PeriodoAcademicoComponent},
            { path: 'unidades-academicas', component: ListaUnidadesAcademicasComponent},
            { path: 'bimestres-academicos', component: ListaBimestresAcademicosComponent},
            { path: 'area-asignaturas', component: ListaAreaCursosComponent},
            { path: 'asignaturas', component: ListaAsignaturasComponent},
            { path: 'categoria-notas', component: ListaCategoriaNotasComponent},
            { path: 'tipos-notas', component: ListaTiposNotasComponent},
            { path: 'registro-incidencia', component: RegistroIncidenciasComponent},
            { path: 'registro-comentario', component: RegistroComentarioComponent},
            { path: 'asignar-docentes', component: AsignardocentesComponent},
            { path: 'registro-notas-padre', component: RegistroNotasPadreComponent},
            { path: 'registro-notas-conducta', component: RegistroNotasComportamientoComponent},
            { path: 'lista-notas-conportamiento', component: ListanotascomportamientoComponent},
            { path: 'registrar-asistencia', component: RegistrarAsistenciaComponent},
            { path: 'ver-notas-conducta', component: VerNotaComportamientoAlumnoComponent},
            {path:'', redirectTo:'/dashboard', pathMatch:'full'}
        ]
    },
    {
        path: '**', component: NotFoundComponentComponent,
    } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class PagesRoutingModule{}