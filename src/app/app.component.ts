import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilmeComponent } from './Filmes/filme/filme.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , FilmeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Consumir-Api';
}