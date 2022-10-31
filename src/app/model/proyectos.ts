export class Proyectos {
  id?: number;
  nombreProyec: string;
  fecha: Date;
  descripcionProyec: string;
  linkProyec: string;

  constructor(nombreProyec: string, fecha:Date, descripcionProyec:string, linkProyec:string){

    this.nombreProyec = nombreProyec;
    this.fecha = fecha;
    this.descripcionProyec = descripcionProyec;
    this.linkProyec = linkProyec;
  }
}
