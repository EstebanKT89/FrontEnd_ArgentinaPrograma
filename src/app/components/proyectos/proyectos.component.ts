import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Proyectos } from 'src/app/model/proyectos';
import { ProyectosService } from 'src/app/service/proyectos.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';
import { PopupProyectosComponent } from './popup-proyectos.component';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit, OnDestroy {
  proyecto: Proyectos[] = [];

  isLogged = false;
  subscription: Subscription;

  @ViewChild(PopupProyectosComponent) addview! : PopupProyectosComponent;

  constructor(
    public proyectosService: ProyectosService, 
    private tokenService: TokenService) {}

    ngOnDestroy(): void {
      this.subscription.unsubscribe;
    }

  ngOnInit(): void {
    this.cargarProyectos();

    this.subscription = this.proyectosService.refresh$.subscribe(() => {
      this.cargarProyectos();
    });

    if(this.tokenService.getToken()){
      this.isLogged = true;
    }else{
      this.isLogged = false;
    }
  }

  cargarProyectos():void{
    this.proyectosService.lista().subscribe(
      data => {
        this.proyecto = data;
      }
    )
  }

  edit(code:number){
    this.addview.LoadEditData(code)
    this.addview.edit = true;
    this.addview.titulo = "Editar Proyecto";
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
      text: '¿Está seguro que desea eliminar el proyecto seleccionado?',
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
          this.proyectosService.delete(id).subscribe(
            data => {
              this.cargarProyectos();
              swalWithBootstrapButtons.fire({    
                position: 'top',
                title:'¡Eliminada!',
                text:'Proyecto eliminada con éxito.',
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
