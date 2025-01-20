import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Filme, FilmeComId } from './models/filme';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
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
  filmeEncontrado$?: Observable<Filme>;
  valorBuscaFilme = '';

  //Adicionar Filme
  tituloFilme = ''
  generoFilme = ''
  duracaoFilme = 0

  //Atualizar um Filme

  // Para lidar com filmes com o id (para edição, etc.)
  filmesComId$?: Observable<FilmeComId[]>;
  
  tituloAtualizarFilme = '';
  generoAtualizarFilme = '';
  duracaoAtualizarFilme = 0;
  idFilmeParaAtualizar?: number;

  preencherCamposParaAtualizacao(filme: FilmeComId) {
    this.idFilmeParaAtualizar = filme.id; // Armazena o ID do filme
    console.log('ID do filme para atualizar:', this.idFilmeParaAtualizar); // Verifique o valor aqui
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
  
  buscarFilmePorId() {
    if(!this.valorBuscaFilme){
      return;
    }
    this.filmeEncontrado$ = this.http.get<Filme>(`${this.url}/filme/${this.valorBuscaFilme}`)
  }

  adicionarFilme() {
    if(!this.tituloFilme && !this.generoFilme && this.duracaoFilme === 0){
      return;
    }

    const criarFilme: Filme = {
      titulo: this.tituloFilme,
      genero: this.generoFilme,
      duracao: this.duracaoFilme
    };
  
    this.http.post<Filme>(`${this.url}/filme`, criarFilme)
      .subscribe({
        next: (novoFilme) => {
          console.log('Filme cadastrado com sucesso:', novoFilme);
  
          // Chama o método obterFilmes para atualizar a lista
          this.obterFilmes();
  
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
        id: this.idFilmeParaAtualizar,  // Este ID já está na URL
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
    // Faz a requisição DELETE para excluir o filme
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
