import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Filme } from '../../models/filme';
import { FilmeService } from '../../Filme.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filme',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './filme.component.html',
  styleUrl: './filme.component.css'
})

export class FilmeComponent implements OnInit{

  filmes: Filme[] = [];
  filmesFiltrados: Filme[] = []; 
  valorBuscaFilme: string = '';  
  id: string = '';

  tituloFilme: string = '';
  generoFilme: string = '';
  duracaoFilme: number = 0;

  tituloAtualizarFilme: string = '';
  generoAtualizarFilme: string = '';
  duracaoAtualizarFilme: number = 0;
  idFilmeParaAtualizar: number | undefined; 

  constructor(private filmeService: FilmeService, private snackBar: MatSnackBar){}

    
  ngOnInit(): void {
    this.carregarFilmes();
  }

  carregarFilmes(): void {
    this.filmeService.PegarTodos().subscribe({
      next: (resultado) => {
        this.filmes = resultado; 
      },
      error: (err) => {
        console.error('Erro ao carregar os filmes:', err);
      }
    });
  }

  buscarFilmes(): void {
    if (this.valorBuscaFilme.trim()) {
      this.filmeService.buscarFilmesPorTitulo(this.valorBuscaFilme).subscribe({
        
        next: (resultado) => {
          this.filmesFiltrados = resultado; 
        },

        error: (erro) => {
          console.error('Erro ao buscar os filmes:', erro);
        }
      });
    } 
    else {
      this.filmesFiltrados = []; 
    }
  }

  adicionarFilme(): void {

    if (this.tituloFilme.trim() && this.generoFilme.trim() && this.duracaoFilme > 0) {
      const novoFilme: Filme = {
        titulo: this.tituloFilme,
        genero: this.generoFilme,
        duracao: this.duracaoFilme
      };

      this.filmeService.SalvarFilme(novoFilme).subscribe({
        
        next: (resultado) => {
          this.snackBar.open('Filme cadastrado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.filmes.push(resultado);

          this.tituloFilme = '';
          this.generoFilme = '';
          this.duracaoFilme = 0;
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar o filme. Tente novamente.', 'Fechar', {
            duration: 3000
          });
          console.error('Erro ao salvar filme:', err);
        }
      });
    }
    else {
      this.snackBar.open('Preencha todos os campos antes de cadastrar um filme.', 'Fechar', {
        duration: 3000
      });
    }
  }

  preencherCamposParaAtualizacao(filme: Filme): void {
    this.idFilmeParaAtualizar = filme.id;
    this.tituloAtualizarFilme = filme.titulo;
    this.generoAtualizarFilme = filme.genero;
    this.duracaoAtualizarFilme = filme.duracao;
  }
  
  atualizarFilme(): void {
    if (this.idFilmeParaAtualizar !== undefined && this.tituloAtualizarFilme.trim() && this.generoAtualizarFilme.trim() && this.duracaoAtualizarFilme > 0) {
      const filmeAtualizado: Filme = {
        id: this.idFilmeParaAtualizar,
        titulo: this.tituloAtualizarFilme,
        genero: this.generoAtualizarFilme,
        duracao: this.duracaoAtualizarFilme
      };
  
      this.filmeService.AtualizarFilme(filmeAtualizado).subscribe({
        
        next: (resultado) => {
          this.snackBar.open('Filme atualizado com sucesso!', 'Fechar', {
            duration: 3000
          });

          this.carregarFilmes();

          this.tituloAtualizarFilme = '';
          this.generoAtualizarFilme = '';
          this.duracaoAtualizarFilme = 0;
          this.idFilmeParaAtualizar = undefined; 
        },

        error: (err) => {
          this.snackBar.open('Erro ao atualizar o filme. Tente novamente.', 'Fechar', {
            duration: 3000
          });

          console.error('Erro ao atualizar o filme:', err);
        }
      });
    }
  }

  excluirFilme(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID inválido para exclusão');
      return;
    }

    const confirmar = confirm('Você tem certeza que deseja excluir este filme?');
    
    if (confirmar) {
      this.filmeService.ExcluirFilme(id).subscribe({
        next: () => {
          this.snackBar.open('Filme excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarFilmes(); 
        },
        error: (erro) => {
          this.snackBar.open('Erro ao excluir o filme. Tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
