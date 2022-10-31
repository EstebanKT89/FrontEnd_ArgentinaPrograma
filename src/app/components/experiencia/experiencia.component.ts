import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Experiencia } from 'src/app/model/experiencia';
import { ExperienciaService } from 'src/app/service/experiencia.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';
import { PopupExperienciaComponent } from './popup-experiencia.component';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css'],
})
export class ExperienciaComponent implements OnInit, OnDestroy {
  experiencia: Experiencia[] = [];

  isLogged = false;
  subscription: Subscription;

  @ViewChild(PopupExperienciaComponent) addview! : PopupExperienciaComponent;

  constructor(
    public experienciaService: ExperienciaService, 
    private tokenService: TokenService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  ngOnInit(): void {
    this.cargarExperiencia();

    this.subscription = this.experienciaService.refresh$.subscribe(() => {
      this.cargarExperiencia();
    });
    
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }
  cargarExperiencia():void{
    this.experienciaService.lista().subscribe(
      data => { this.experiencia = data;});
  }

  edit(code:number){
    this.addview.LoadEditData(code)
    this.addview.edit = true;
    this.addview.titulo = "Editar Experiencia";
    this.addview.btnModal = "Modificar";
  }

  delete(id?: number){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
    .fire({        
      position: 'top',
      title: '¿Está seguro?',
      text: '¿Está seguro que desea eliminar la experiencia seleccionada?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, eliminar!',
      cancelButtonText: '¡No, cancelar!',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      reverseButtons: false,
    })
    .then((result) => {
      if (result.value) {
        if(id != undefined){
          this.experienciaService.delete(id).subscribe(
            (data) => {                
              this.cargarExperiencia();
              swalWithBootstrapButtons.fire({    
                position: 'top',
                title:'¡Eliminada!',
                text:'Experiencia eliminada con éxito.',
                icon:'success'
              });
            }, (err) => {
              alert("No se pudo eliminar la experiencia");
            }
          );
        };
      }
    });
  }
}