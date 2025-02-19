import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// inventemos un producto para el ejemplo del reset del formulario al inicio, como si fuera valor por defecto enviado por el backend
const tarjeta = {
  name: 'Rtx 5090',
  price: 2500,
  inStorage: 6,
};

@Component({
  templateUrl: './basic-page.component.html',
  styles: ``,
})
// para establecer un valor por defecto al inicio del formulario, se puede hacer de dos maneras, la primera es en el FormControl, la segunda es en el reset() del formulario, para esta ultima tenemos que implementar el metodo ngOnInit() de Angular y dentro de este metodo establecer los valores por defecto
export class BasicPageComponent implements OnInit {
  // Formulario reactivo con FormGroup tradicional

  // nombre del campo: new FormControl(valor por defecto, validadores sincronos, validadores asincronos)

  // public basicForm: FormGroup = new FormGroup({
  //   name: new FormControl(''),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  // });

  // Formulario reactivo con FormBuilder

  // inyectar FormBuilder en el constructor

  //usando el metodo group() del FormBuilder para crear un FormGroup se envia un objeto con la estructura de los campos con el orden de valores del FormControl

  // usando validators podemos validar los campos para que se cumpla las condiciones que ponemos, seria el segundo parametro del FormControl para sincronos y el tercero para asincronos, aunque hagamos las validaciones aqui, no van a funcionar si no las agregamos en el onSave()

  public basicForm: FormGroup = this.fb.group({
    // en este caso que sea requerido y con un minimo de 3 caracteres
    name: ['', [Validators.required, Validators.minLength(3)]],
    // en este caso que sea requerido y el valor no sea menor a 0 o negativo
    price: [0, [Validators.required, Validators.min(0)]],
    // en este caso que sea requerido y el valor no sea menor a 0 o negativo
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // aqui podemos implementar el metodo reset() para establecer los valores por defecto del formulario
    // this.basicForm.reset(tarjeta);
  }

  isValidField(field: string): boolean | null {
    // usamos la validacion del ejemplo feo del html pero usando el field que se quiera evaluar como parametro
    return (
      this.basicForm.controls[field].errors &&
      this.basicForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    // basado en el campo validamos que el formulario tenga ese campo, si no, regresamos nulo
    if (!this.basicForm.controls[field]) return null;
    // tomamos los errores del campo que se esta evaluando y si no hay asignamos  objeto vacio
    const errors = this.basicForm.controls[field].errors || {};
    // hacemos un for of y evaluamos todos los keys del objeto errors
    for (const key of Object.keys(errors)) {
      //usando switch evaluamos los keys y regresamos el mensaje correspondiente
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Este campo debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `El valor minimo debe ser ${errors['min'].min} o mayor`;
      }
    }
    // cualquier otro caso regresamos nulo
    return null;
  }

  onSave(): void {
    // validamos el formulario usando el metodo valid o invalid de nuestro basicForm
    if (this.basicForm.invalid) {
      // marcamos todos los campos como touched para que se muestren los mensajes de error
      this.basicForm.markAllAsTouched();
      return;
    }
    console.log(this.basicForm.value);
    // reset resetea los valores del formulario a los valores por defecto pristine, untouched, etc
    // this.basicForm.reset();
    // si enviamos un objeto como prametro al reset con los valores que queremos que tenga el formulario, se reseteara con esos valores
    this.basicForm.reset({
      price: 10,
      inStorage: 2,
    });
  }
}
