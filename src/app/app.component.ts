import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'Mutants';

  str = '';  
  fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
      adn: [[], Validators.required]
  });
  
  isMutant(dna: string[]): boolean {
    const N = dna.length;
    let sequenceCount = 0;
    
    const checkDirection = (row: number, col: number, rowDir: number, colDir: number): boolean => {
        const base = dna[row][col];
        for (let i = 1; i < 4; i++) {
            const newRow = row + i * rowDir;
            const newCol = col + i * colDir;
            if (newRow < 0 || newRow >= N || newCol < 0 || newCol >= N || dna[newRow][newCol] !== base) {
                return false;
            }
        }
        return true;
    };
    
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (
                j <= N - 4 && checkDirection(i, j, 0, 1) // Horizontal
            ) {
                sequenceCount++;
            }
            if (
                i <= N - 4 && checkDirection(i, j, 1, 0) // Vertical
            ) {
                sequenceCount++;
            }
            if (
                i <= N - 4 && j <= N - 4 && checkDirection(i, j, 1, 1) // Diagonal derecha
            ) {
                sequenceCount++;
            }
            if (
                i <= N - 4 && j >= 3 && checkDirection(i, j, 1, -1) // Diagonal izquierda
            ) {
                sequenceCount++;
            }
            if (sequenceCount > 1) {
                return true;
            }
        }
    }
    
    return false;

  }

  onSubmit(): void {

    this.str = this.form.value.adn.trim(); // Elimina espacios en blanco extra
    const dnaArray = this.str.split(',').map(seq => seq.trim().toUpperCase()); // Asegura mayúsculas y limpieza

    // Validar que todas las secuencias sean del mismo tamaño y solo contengan A, T, C, G
    const isValid = dnaArray.every(seq => /^[ATCG]+$/.test(seq) && seq.length === dnaArray.length);

    if (!isValid) {
        alert("ADN inválido: debe contener solo A, T, C, G y ser NxN.");
        console.error("ADN inválido: debe contener solo A, T, C, G y ser NxN.");
        return;
    }

    console.log(dnaArray);

    if(this.isMutant(dnaArray)){
      alert("Es mutante");
    }
    else{
      alert("No es mutante");
    }
    
    console.log(this.isMutant(dnaArray));
  }

}
