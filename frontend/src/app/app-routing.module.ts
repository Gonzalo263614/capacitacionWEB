import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MaestroComponent } from './maestro/maestro.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { InstructorComponent } from './instructor/instructor.component';
import { JefeComponent } from './jefe/jefe.component';
import { ProfileComponent } from './profile/profile.component'; // Importa el componente de perfil
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component';
import { CursoComponent } from './curso/curso.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { EncuestajefeComponent } from './encuestajefe/encuestajefe.component';
import { DetalleCursoAdminComponent } from './detalle-curso-admin/detalle-curso-admin.component';
import { SubdirectorComponent } from './subdirector/subdirector.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Registro2Component } from './registro2/registro2.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'maestro', component: MaestroComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'registro2', component: Registro2Component },
  { path: 'instructor', component: InstructorComponent },
  { path: 'jefe', component: JefeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'subdirector', component: SubdirectorComponent },
  // Ruta para ver el detalle del curso
  { path: 'curso/:id/detalle', component: CursoDetalleComponent }, 
  
  // Ruta para ver las asistencias del curso
  { path: 'curso/:id/asistencias', component: CursoComponent }, 
  { path: 'encuesta', component: EncuestaComponent }, 
  { path: 'encuestajefe', component: EncuestajefeComponent }, 
  { path: 'detallecursoadmin/:id', component: DetalleCursoAdminComponent },
  { path: 'change-password/:userId', component: ChangePasswordComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
