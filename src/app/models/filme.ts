export interface Filme {
    titulo: string,
    genero: string,
    duracao: number
}

// Extensão da interface para incluir o ID
export interface FilmeComId extends Filme {
    id: number;
  }