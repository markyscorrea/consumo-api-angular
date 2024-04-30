import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MusicService } from './services/music-service.service';
import { Music } from './interfaces/music.interface';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'consumo-api-angular';

  listaMusicas: Music[] = [];

  //Esse modelo usado com Async Pipe, o angular fica por conta de se inscrever no Observable
  //musicas$ = new Observable<Music[]>();

  id: any = '';
  artista = '';
  musica = '';

  sub = new Subscription();

  constructor(private musicService: MusicService) {
    this.obterMusicas();
  }

  obterMusicas() {
    const subMusicas = this.musicService.getMusics().subscribe(musics => {
      this.listaMusicas = musics;
    })

    this.sub.add(subMusicas);

    // Esse modelo usado com Async Pipe, o angular fica por conta de se inscrever no Observable
    //this.musicas$ = this.musicService.getMusics();
  }

  buttonClick() {

    if(this.id){
      this.editarMusica();
      return;
    }

    if (!this.artista || !this.musica) return;
    let numeroId = this.listaMusicas.length + 1;
    const subSave = this.musicService.saveMusic({
      id: numeroId.toString(),
      artista: this.artista,
      musicaMaisConhecida: this.musica
    }).subscribe(_ => this.obterMusicas())

    this.artista = '';
    this.musica = '';

    this.sub.add(subSave);
  }

  preencherCampos(musica: Music){
    this.id = musica.id
    this.artista = musica.artista,
    this.musica = musica.musicaMaisConhecida
  }

  editarMusica(){
    const subEdit = this.musicService.editMusic({
      id: this.id,
      artista: this.artista,
      musicaMaisConhecida: this.musica
    }).subscribe(_ => this.obterMusicas())

    this.id = '';
    this.artista = '';
    this.musica = '';

    this.sub.add(subEdit);
  }

  removerMusica(id: string) {
    const subRemove = this.musicService.deleteMusic(id).subscribe(_ => this.obterMusicas())

    this.sub.add(subRemove);
  }

  cancelarEdicao(){
    this.id = '';
    this.artista = '';
    this.musica = '';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
