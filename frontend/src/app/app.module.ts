// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaestroComponent } from './maestro/maestro.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { InstructorComponent } from './instructor/instructor.component';
import { JefeComponent } from './jefe/jefe.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component';
import { CursoComponent } from './curso/curso.component';
import { EncuestaComponent } from './encuesta/encuesta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MaestroComponent,
    AdminComponent,
    RegisterComponent,
    InstructorComponent,
    JefeComponent,
    NavbarComponent,
    ProfileComponent,
    CursoDetalleComponent,
    CursoComponent,
    EncuestaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
