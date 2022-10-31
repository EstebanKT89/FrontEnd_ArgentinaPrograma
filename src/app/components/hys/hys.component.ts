import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Skill } from 'src/app/model/skill';
import { SkillService } from 'src/app/service/skill.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';
import { PopupHysComponent } from './popup-hys.component';

@Component({
  selector: 'app-hys',
  templateUrl: './hys.component.html',
  styleUrls: ['./hys.component.css'],
})
export class HysComponent implements OnInit, OnDestroy {
  skill: Skill[] = [];

  isLogged = false;  
  subscription: Subscription;

  @ViewChild(PopupHysComponent) addview! : PopupHysComponent;

  constructor(public skillService: SkillService,
             private tokenService: TokenService) {}

  ngOnDestroy(): void {
      this.subscription.unsubscribe;
  }

  ngOnInit(): void {
    this.cargarSkills();

    this.subscription = this.skillService.refresh$.subscribe(() => {
      this.cargarSkills();
    });

    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  cargarSkills(): void {
    this.skillService.lista().subscribe((data) => {
      this.skill = data;
    });
  }

  edit(code:number){
    this.addview.LoadEditData(code)
    this.addview.edit = true;
    this.addview.titulo = "Editar Skill";
    this.addview.btnModal = 'Modificar';
  }

  delete(id: number) {
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
      text: '¿Está seguro que desea eliminar la skill seleccionada?',
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
        if (id != undefined) {
          this.skillService.delete(id).subscribe(
            (data) => {
              this.cargarSkills();
              swalWithBootstrapButtons.fire({    
                position: 'top',
                title:'¡Eliminada!',
                text:'Skill eliminada con éxito.',
                icon:'success'
              });
            },
            (err) => {
              alert('No se pudo borrar la skill');
            }
          );
        };
      }
    });
  }    
}
