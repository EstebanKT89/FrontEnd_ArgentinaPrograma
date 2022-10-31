import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Persona } from 'src/app/model/persona.model';
import { PersonaService } from 'src/app/service/persona.service';
import { TokenService } from 'src/app/service/token.service';
import { PopupAcercadeComponent } from './popup-acercade.component';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css'],
})
export class AcercaDeComponent implements OnInit, OnDestroy {
  persona: Persona = null;

  isLogged = false;
  subscription: Subscription;

  @ViewChild(PopupAcercadeComponent) addview! : PopupAcercadeComponent;

  constructor(
    public personaService: PersonaService, 
    private tokenService: TokenService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  ngOnInit(): void {
   /* this.personaService.getPersona().subscribe((data) => {
      this.persona = data;
    });*/
    this.cargarPersona();

    this.subscription = this.personaService.refresh$.subscribe(() => {
      this.cargarPersona();
    });

    if(this.tokenService.getToken()){
      this.isLogged = true;
    }else{
      this.isLogged = false;
    }
  }
  
  cargarPersona(){
    this.personaService.detail(1).subscribe(
      data => {
        this.persona = data;
      }
    )
  }

  edit(code:number){
    this.addview.LoadEditData(code)
    this.addview.edit = true;
  }

}
