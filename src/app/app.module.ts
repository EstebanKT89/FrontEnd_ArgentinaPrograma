import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { SocialLoginComponent } from './components/header/social-login/social-login.component';
import { ExperienciaComponent } from './components/experiencia/experiencia.component';
import { EducacionComponent } from './components/educacion/educacion.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HysComponent } from './components/hys/hys.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { interceptorProvider } from './service/interceptor-service';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { PopupExperienciaComponent } from './components/experiencia/popup-experiencia.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupEducacionComponent } from './components/educacion/popup-educacion.component';
import { PopupHysComponent } from './components/hys/popup-hys.component';
import { PopupProyectosComponent } from './components/proyectos/popup-proyectos.component';
import { PopupAcercadeComponent } from './components/acerca-de/popup-acercade.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AcercaDeComponent,
    SocialLoginComponent,
    ExperienciaComponent,
    EducacionComponent,
    HysComponent,
    ProyectosComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    PopupExperienciaComponent,
    PopupEducacionComponent,
    PopupHysComponent,
    PopupProyectosComponent,
    PopupAcercadeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgCircleProgressModule.forRoot({}),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    NgbModule
  ],
  providers: [
    interceptorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
