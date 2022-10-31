import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Skill } from 'src/app/model/skill';
import { SkillService } from 'src/app/service/skill.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-hys',
  templateUrl: './popup-hys.component.html',
  styleUrls: ['./popup-hys.component.css']
})
export class PopupHysComponent implements OnInit {

  @ViewChild('content') addview!: ElementRef;

  titulo = '';
  btnModal = '';
  isLogged = false;
  edit = false;
  errormessage = '';
  errorclass = '';
  saveResponse: any;
  editData: any;

  skillForm = new FormGroup({
    nombre: new FormControl('', Validators.compose([Validators.required])),
    porcentaje: new FormControl('', Validators.compose([Validators.required])),
  });

  constructor(
    private tokenService: TokenService,
    private modalService: NgbModal,
    public skillService: SkillService,
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
    console.log(this.skillForm.getRawValue());

    if (this.skillForm.valid) {
      const skill = new Skill(this.skillForm.get('nombre').value, 
                                          this.skillForm.get('porcentaje').value);
      this.skillService.save(skill).subscribe(
        (data) => {       

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Skill Creada',
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
          text: 'Skill ya existente',
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
    
    console.log(this.skillForm.getRawValue());

    if (this.skillForm.valid) {
      let skill = new Skill(this.skillForm.get('nombre').value, 
                                          this.skillForm.get('porcentaje').value);

        this.skillService.update(this.editData.id, skill).subscribe(
          data => {
            skill = data; 
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'skill modificada',
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
    this.skillService.detail(code).subscribe(
      data => {
        this.editData = data;
        this.skillForm.setValue({nombre:this.editData.nombre,porcentaje:this.editData.porcentaje});        
      })    
  }

  Clearform(){
    this.skillForm.setValue({nombre:'',porcentaje:''})
  }

  open(){
    this.edit = false;
    this.titulo = "Nueva skill";
    this.btnModal = 'Agregar skill';
    this.Clearform();
    this.modalService.open(this.addview, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{      
    }, (reason) => {      
    });
  }
}
