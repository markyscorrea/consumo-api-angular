import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Music } from '../interfaces/music.interface';


@Injectable({
  providedIn: 'root'
})
export class MusicService{

  private url = `${environment.api}/musics`;

  constructor(private httpCliente: HttpClient) { }

  getMusics(){
    return this.httpCliente.get<Music[]>(`${this.url}`);
  }

  saveMusic(musica: Music){
    return this.httpCliente.post<Music>(this.url, musica);
  }

  editMusic(musica: Music){
    return this.httpCliente.put<Music>(`${this.url}/${musica.id}`, musica);
  }

  deleteMusic(id: string){
    return this.httpCliente.delete<void>(`${this.url}/${id}`);
  }
  
}
