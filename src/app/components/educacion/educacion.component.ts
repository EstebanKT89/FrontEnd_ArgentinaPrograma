import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Educacion } from 'src/app/model/educacion';
import { EducacionService } from 'src/app/service/educacion.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';
import { PopupEducacionComponent } from './popup-educacion.component';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css'],
})
export class EducacionComponent implements OnInit, OnDestroy {

  educacion: Educacion[] = [];
  isLogged = false;
  subscription: Subscription;

  @ViewChild(PopupEducacionComponent) addview! : PopupEducacionComponent;

  constructor(public educacionService:EducacionService, 
              private tokenService:TokenService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }


  ngOnInit(): void {
    this.cargarEducacion();

    this.subscription = this.educacionService.refresh$.subscribe(() => {
      this.cargarEducacion();
    })
    if(this.tokenService.getToken()){
      this.isLogged = true;
    }else{
      this.isLogged = false;
    }
  }

  cargarEducacion():void{
    this.educacionService.lista().subscribe(
      data => {
        this.educacion = data;
      }
    )
  }

  edit(code:number){
    this.addview.LoadEditData(code)
    this.addview.edit = true;
    this.addview.titulo = "Editar Educación";
    this.addview.btnModal = 'Modificar';
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
        text: '¿Está seguro que desea eliminar la educación seleccionada?',
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
            this.educacionService.delete(id).subscribe(
              data => {
                this.cargarEducacion();
                swalWithBootstrapButtons.fire({    
                  position: 'top',
                  title:'¡Eliminada!',
                  text:'Educación eliminada con éxito.',
                  icon:'success'
              });
              }, err => {
              alert("No se pudo eliminar");
              }
            );
          };
        }
      });
  }
}


