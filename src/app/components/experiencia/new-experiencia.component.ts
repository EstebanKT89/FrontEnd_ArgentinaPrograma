import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Experiencia } from 'src/app/model/experiencia';
import { ExperienciaService } from 'src/app/service/experiencia.service';

@Component({
  selector: 'app-new-experiencia',
  templateUrl: './new-experiencia.component.html',
  styleUrls: ['./new-experiencia.component.css'],
})
export class NewExperienciaComponent implements OnInit {
  nombreExp: string = '';
  descripcionExp: string = '';

  constructor(private experienciaService: ExperienciaService, private router: Router) {}

  ngOnInit(): void {
    
  }

  onCreate(): void {
    const experiencia = new Experiencia(this.nombreExp, this.descripcionExp);
    this.experienciaService.save(experiencia).subscribe(
      data => {
        alert('Experiencia añadida');
        this.router.navigate(['']);
      }, err => {
        alert('Falló');
        this.router.navigate(['']);
      }
    )
  }
}
