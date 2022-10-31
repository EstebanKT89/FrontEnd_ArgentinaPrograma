import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from 'src/app/model/persona.model';
import { ImageService } from 'src/app/service/image.service';
import { PersonaService } from 'src/app/service/persona.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-acercade',
  templateUrl: './popup-acercade.component.html',
  styleUrls: ['./popup-acercade.component.css']
})
export class PopupAcercadeComponent implements OnInit {

  @ViewChild('content') addview!: ElementRef;

  isLogged = false;
  edit = false;
  errormessage = '';
  errorclass = '';
  saveResponse: any;
  editData: any;
  idImg: any;

  perfilForm = new FormGroup({
    nombre: new FormControl('', Validators.compose([Validators.required])),
    apellido: new FormControl('', Validators.compose([Validators.required])),
    profesion: new FormControl('', Validators.compose([Validators.required])),
    descripcion: new FormControl('', Validators.compose([Validators.required])),
    img: new FormControl('')
  });


  constructor(
    private tokenService: TokenService,
    private modalService: NgbModal,
    public personaService: PersonaService,
    public imageService: ImageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  onUpdate(){    
    console.log(this.perfilForm.getRawValue());

    if (this.perfilForm.valid) {
      let persona = new Persona (this.perfilForm.get('nombre').value, 
                                 this.perfilForm.get('apellido').value,
                                 this.perfilForm.get('profesion').value,
                                 this.perfilForm.get('descripcion').value,
                                 this.perfilForm.get('img').value,);

        persona.img = this.imageService.url;
        this.personaService.update(this.editData.id, persona).subscribe(
          data => {
            persona = data; 
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Perfil modificado',
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

  uploadImage($event: any, id: number){
     
    const name = "perfil_" + this.perfilForm.get('nombre').value + id;
    this.imageService.uploadImage($event, name);
  }

  LoadEditData(code: number) {    
    this.open();
    console.log(code)
    this.personaService.detail(code).subscribe(
      data => {
        this.editData = data;
        this.perfilForm.patchValue({nombre:this.editData.nombre,
                                  apellido:this.editData.apellido,
                                  profesion:this.editData.profesion,
                                  descripcion:this.editData.descripcion});

        console.log(this.perfilForm.getRawValue());        
        console.log(this.perfilForm.valid);
      })    
  }

  Clearform(){
    this.perfilForm.setValue({nombre:'',
                              apellido:'',
                              profesion:'',
                              descripcion:'',
                              img:''});
  }

  open(){
    this.edit = false;
    this.Clearform();
    this.modalService.open(this.addview, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{      
    }, (reason) => {      
    });
  }

}
