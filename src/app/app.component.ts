import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Filme, FilmeComId } from './models/filme';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Consumir-Api';
  http = inject(HttpClient);
  url = 'https://localhost:7153';
  //filmes: Filme[] = [];

  //Listar Filmes
  filmes$?: Observable<Filme[]>;

  //Buscar Filme
  filmesEncontrados: Filme[] = [];
  valorBuscaFilme = '';

  //Adicionar Filme
  tituloFilme = ''
  generoFilme = ''
  duracaoFilme = 0

  //Atualizar um Filme
  filmesComId$?: Observable<FilmeComId[]> | undefined;
  
  tituloAtualizarFilme = '';
  generoAtualizarFilme = '';
  duracaoAtualizarFilme = 0;
  idFilmeParaAtualizar?: number;

  preencherCamposParaAtualizacao(filme: FilmeComId) {
    this.idFilmeParaAtualizar = filme.id;
    console.log('ID do filme para atualizar:', this.idFilmeParaAtualizar);
    this.tituloAtualizarFilme = filme.titulo;
    this.generoAtualizarFilme = filme.genero;
    this.duracaoAtualizarFilme = filme.duracao;
  }  

  ngOnInit(): void {
    this.obterFilmes();
    this.obterFilmesComId();
  }

  obterFilmes() {
    this.filmes$ = this.http.get<Filme[]>(`${this.url}/filme`);
  }

  obterFilmesComId() {
    this.filmesComId$ = this.http.get<FilmeComId[]>(`${this.url}/filme`);
  }
  
  buscarFilmes() {
    if (!this.valorBuscaFilme.trim()) { 
      this.filmesEncontrados = []; 
      return; 
    }
  
    this.http.get<Filme[]>(`${this.url}/filme/buscar/${this.valorBuscaFilme}`).subscribe({
      next: (filmes) => { 
        this.filmesEncontrados = filmes; 
      },
      error: (error) => {
        if (error.status === 404) {
          this.filmesEncontrados = [];
        } else {
          console.error('Erro ao buscar filmes:', error);
        }
      }
    });
  }
  
  // adicionarFilme() {
  //   if(!this.tituloFilme && !this.generoFilme && this.duracaoFilme === 0){
  //     return;
  //   }

  //   const criarFilme: Filme = {
  //     titulo: this.tituloFilme,
  //     genero: this.generoFilme,
  //     duracao: this.duracaoFilme
  //   };
  
  //   this.http.post<Filme>(`${this.url}/filme`, criarFilme)
  //     .subscribe({
  //       next: (novoFilme) => {
  //         console.log('Filme cadastrado com sucesso:', novoFilme);
  
  //         this.obterFilmes();
  
  //         // Limpa os campos
  //         this.tituloFilme = '';
  //         this.generoFilme = '';
  //         this.duracaoFilme = 0;
  //       },
  //       error: (erro) => {
  //         console.error('Erro ao cadastrar o filme:', erro);
  //       }
  //     });
  // }

  adicionarFilme() {
    if (!this.tituloFilme || !this.generoFilme || this.duracaoFilme === 0) {
      return;
    }

    const criarFilme: Filme = {
      titulo: this.tituloFilme,
      genero: this.generoFilme,
      duracao: this.duracaoFilme
    };

    this.http.post<Filme>(`${this.url}/filme`, criarFilme).subscribe({
      next: (novoFilme) => {
        console.log('Filme cadastrado com sucesso:', novoFilme);

        // Recarregar a página
        window.location.reload();

        // Limpa os campos
        this.tituloFilme = '';
        this.generoFilme = '';
        this.duracaoFilme = 0;
      },
      error: (erro) => {
        console.error('Erro ao cadastrar o filme:', erro);
      }
    });
  }


  
  atualizarFilme() {
    if (this.idFilmeParaAtualizar !== undefined) { 
      const atualizarFilme: FilmeComId = {
        id: this.idFilmeParaAtualizar, 
        titulo: this.tituloAtualizarFilme,
        genero: this.generoAtualizarFilme,
        duracao: this.duracaoAtualizarFilme
      };
  
      this.http.put<FilmeComId>(`${this.url}/filme/${this.idFilmeParaAtualizar}`, atualizarFilme)
        .subscribe({
          next: () => {
            console.log('Filme atualizado com sucesso');
            this.obterFilmesComId();
            this.tituloAtualizarFilme = '';
            this.generoAtualizarFilme = '';
            this.duracaoAtualizarFilme = 0;
          },
          error: (erro) => {
            console.error('Erro ao atualizar o filme:', erro);
          }
        });
    } else {
      console.error('ID do filme para atualizar não definido.');
    }
  }

  excluirFilme(id: number): void {
    this.http.delete(`${this.url}/filme/${id}`).subscribe({
      next: () => {
        console.log('Filme excluído com sucesso');
        
        // Atualiza a lista de filmes após exclusão
        this.obterFilmesComId();
      },
      error: (erro) => {
        console.error('Erro ao excluir o filme:', erro);
      }
    });
  }
  

}


  //filmeEncontrado$?: Observable<Filme>;