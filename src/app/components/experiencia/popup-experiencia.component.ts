import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Experiencia } from 'src/app/model/experiencia';
import { ExperienciaService } from 'src/app/service/experiencia.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-experiencia',
  templateUrl: './popup-experiencia.component.html',
  styleUrls: ['./popup-experiencia.component.css'],
})
export class PopupExperienciaComponent implements OnInit {
  
  @ViewChild('content') addview!: ElementRef;

  titulo = '';
  btnModal = '';
  isLogged = false;
  edit = false;
  errormessage = '';
  errorclass = '';
  saveResponse: any;
  editData: any;

  expForm = new FormGroup({
    nombreExp: new FormControl('', Validators.compose([Validators.required])),
    descripcionExp: new FormControl('', Validators.compose([Validators.required])),
  });

  constructor(
    private tokenService: TokenService,
    private modalService: NgbModal,
    public experienciaService: ExperienciaService,
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
    console.log(this.expForm.getRawValue());

    if (this.expForm.valid) {
      const experiencia = new Experiencia(this.expForm.get('nombreExp').value, 
                                          this.expForm.get('descripcionExp').value);
      this.experienciaService.save(experiencia).subscribe(
        (data) => {       

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Experiencia Creada',
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
          text: 'Experiencia ya existente',
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
    
    console.log(this.expForm.getRawValue());

    if (this.expForm.valid) {
      let experiencia = new Experiencia(this.expForm.get('nombreExp').value, 
                                          this.expForm.get('descripcionExp').value);

        this.experienciaService.update(this.editData.id, experiencia).subscribe(
          data => {
            experiencia = data; 
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Experiencia modificada',
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
    this.experienciaService.detail(code).subscribe(
      data => {
        this.editData = data;
        this.expForm.setValue({nombreExp:this.editData.nombreExp,descripcionExp:this.editData.descripcionExp});        
      })    
  }

  Clearform(){
    this.expForm.setValue({nombreExp:'',descripcionExp:''})
  }

  open(){
    this.edit = false;
    this.titulo = "Nueva Experiencia";
    this.btnModal = "Agregar Experiencia";
    this.Clearform();
    this.modalService.open(this.addview, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{      
    }, (reason) => {      
    });
  }

}
