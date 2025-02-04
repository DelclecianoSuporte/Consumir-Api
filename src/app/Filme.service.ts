import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filme } from './models/filme';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class FilmeService {

  url = 'https://localhost:7153/filme'; 

  constructor(private http: HttpClient) { }

  PegarTodos(): Observable<Filme[]>{
    return this.http.get<Filme[]>(this.url);
  }

  PegarPeloId(filmeId: string): Observable<{ success: boolean; data: Filme }> {
    const apiUrl = `${this.url}/${filmeId}`;
    return this.http.get<{ success: boolean; data: Filme }>(apiUrl);
  }

  buscarFilmesPorTitulo(titulo: string): Observable<Filme[]> {
    const apiUrl = `${this.url}/buscar/${titulo}`;
    return this.http.get<Filme[]>(apiUrl); 
  }

  SalvarFilme(filme: Filme) : Observable<any>{
    return this.http.post<Filme>(this.url, filme, httpOptions);
  }

  AtualizarFilme(filme: Filme): Observable<any> {
    const apiUrl = `${this.url}/${filme.id}`;
    return this.http.put(apiUrl, filme, httpOptions);
  }

  ExcluirFilme(id: number) : Observable<any>{
    const apiUrl = `${this.url}/${id}`;
    return this.http.delete<string>(apiUrl, httpOptions)
  }

}