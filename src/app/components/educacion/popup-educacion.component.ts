import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Educacion } from 'src/app/model/educacion';
import { EducacionService } from 'src/app/service/educacion.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-educacion',
  templateUrl: './popup-educacion.component.html',
  styleUrls: ['./popup-educacion.component.css']
})
export class PopupEducacionComponent implements OnInit {
  
  @ViewChild('content') addview!: ElementRef;

  titulo = '';
  btnModal = '';
  isLogged = false;
  edit = false;
  errormessage = '';
  errorclass = '';
  saveResponse: any;
  editData: any;

  educForm = new FormGroup({
    nombreEduc: new FormControl('', Validators.compose([Validators.required])),
    descripcionEduc: new FormControl('', Validators.compose([Validators.required])),
  });

  constructor(    
    private tokenService: TokenService,
    private modalService: NgbModal,
    public educacionService: EducacionService,
    private formBuilder: FormBuilder
  ) { }

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
    console.log(this.educForm.getRawValue());

    if (this.educForm.valid) {
      const educacion = new Educacion(this.educForm.get('nombreEduc').value, 
                                          this.educForm.get('descripcionEduc').value);
      this.educacionService.save(educacion).subscribe(
        (data) => {       

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Educación Creada',
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
          text: 'Educación ya existente',
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
    
    console.log(this.educForm.getRawValue());

    if (this.educForm.valid) {
      let educacion = new Educacion(this.educForm.get('nombreEduc').value, 
                                          this.educForm.get('descripcionEduc').value);

        this.educacionService.update(this.editData.id, educacion).subscribe(
          data => {
            educacion = data; 
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Educación modificada',
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
    this.educacionService.detail(code).subscribe(
      data => {
        this.editData = data;
        this.educForm.setValue({nombreEduc:this.editData.nombreEduc,descripcionEduc:this.editData.descripcionEduc});        
      })    
  }

  Clearform(){
    this.educForm.setValue({nombreEduc:'',descripcionEduc:''})
  }

  open(){
    this.edit = false;
    this.titulo = "Nueva Educación";
    this.btnModal = 'Agregar Educación';
    this.Clearform();
    this.modalService.open(this.addview, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{      
    }, (reason) => {      
    });
  }

}
