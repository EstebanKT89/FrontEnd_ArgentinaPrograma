import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Proyectos } from 'src/app/model/proyectos';
import { ProyectosService } from 'src/app/service/proyectos.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-proyectos',
  templateUrl: './popup-proyectos.component.html',
  styleUrls: ['./popup-proyectos.component.css']
})
export class PopupProyectosComponent implements OnInit {

  @ViewChild('content') addview!: ElementRef;

  titulo = '';
  btnModal = '';
  isLogged = false;
  edit = false;
  errormessage = '';
  errorclass = '';
  saveResponse: any;
  editData: any;

  proyecForm = new FormGroup({
    nombreProyec: new FormControl('', Validators.compose([Validators.required])),
    fecha: new FormControl('', Validators.compose([Validators.required])),
    descripcionProyec: new FormControl('', Validators.compose([Validators.required])),
    linkProyec: new FormControl('', Validators.compose([Validators.required]))
  });

  constructor(
    private tokenService: TokenService,
    private modalService: NgbModal,
    public proyectosService: ProyectosService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {    
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  onAction(){
    
    if(this.edit){
      this.onUpdate();
    }
    else{
      this.onCreate();
    }
  }

  onCreate() {    
    console.log(this.proyecForm.getRawValue());

    if (this.proyecForm.valid) {
      const experiencia = new Proyectos(this.proyecForm.get('nombreProyec').value,
                                        this.proyecForm.get('fecha').value, 
                                        this.proyecForm.get('descripcionProyec').value,
                                        this.proyecForm.get('linkProyec').value);
      this.proyectosService.save(experiencia).subscribe(
        (data) => {       

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Proyecto Creado',
            showConfirmButton: true
          });
          setTimeout(() => {
            this, this.modalService.dismissAll();
          });
      }, err => {   
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Error al crear',
          text: 'Proyecto ya existente',
          showConfirmButton: true
        });
        setTimeout(() => {
          this, this.modalService.dismissAll();
        });
          });
    } else {
      this.errormessage = 'Por favor ingresar un dato válido';
      this.errorclass = 'errormessage';
    }
  }

  onUpdate(){
    
    console.log(this.proyecForm.getRawValue());

    if (this.proyecForm.valid) {
      let proyecto = new Proyectos(this.proyecForm.get('nombreProyec').value,
                                   this.proyecForm.get('fecha').value, 
                                   this.proyecForm.get('descripcionProyec').value,
                                   this.proyecForm.get('linkProyec').value);

        this.proyectosService.update(this.editData.id, proyecto).subscribe(
          data => {
            proyecto = data; 
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Proyecto modificado',
              showConfirmButton: true
            });
            setTimeout(() => {
              this, this.modalService.dismissAll();
          });
          }, err => {
            Swal.fire({
              position: 'top',
              icon: 'error',
              title: 'Error al modificar',
              showConfirmButton: true
            });
            setTimeout(() => {
              this, this.modalService.dismissAll();
          });
          }
        );
    } else {
      this.errormessage = 'Por favor ingresar un dato válido';
      this.errorclass = 'errormessage';
    } 
  }

  LoadEditData(code: number) {    
    this.open();
    console.log(code)
    this.proyectosService.detail(code).subscribe(
      data => {
        this.editData = data;
        this.proyecForm.setValue({nombreProyec:this.editData.nombreProyec,
                                  fecha:this.editData.fecha,
                                  descripcionProyec:this.editData.descripcionProyec,
                                  linkProyec:this.editData.linkProyec});        
      })    
  }

  Clearform(){
    this.proyecForm.setValue({nombreProyec:'',fecha:'',descripcionProyec:'',linkProyec:''})
  }

  open(){
    this.edit = false;
    this.titulo = "Nuevo Proyecto";
    this.btnModal = "Agregar Proyecto";
    this.Clearform();
    this.modalService.open(this.addview, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{      
    }, (reason) => {      
    });
  }
}
