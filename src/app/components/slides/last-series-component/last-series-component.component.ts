import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { MovieProviderService } from 'src/app/providers/movie/movie-provider.service';
import { ModalController } from '@ionic/angular';
import { MovieModalComponent } from '../modal-component/modal-component.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

register();

@Component({
  selector: 'app-last-series-component',
  templateUrl: './last-series-component.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [CommonModule, HttpClientModule],
  styleUrls: ['./last-series-component.component.scss'],
})
export class LastSeriesComponentComponent implements OnInit, AfterViewInit {

  movies: any[] = [];
  currentPage: number = 1;
  language: string = 'pt-BR'; // Idioma desejado para a sinopse
  swiper: Swiper;

  constructor(private movieService: MovieProviderService, private modalController: ModalController) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 50); // Espera 1 segundo antes de chamar a função initSwiper
  }

  private initSwiper() {
    this.swiper = new Swiper('.mySwiper');
  }
  
  private loadMovies() {
    this.movieService.getTopSerie(this.currentPage).subscribe(
      (data: any[]) => {
        if (data.length > 0) {
          this.movies.push(...data);
          this.currentPage++;
          if (this.movies.length < 50) {
            this.loadMovies(); // Chama recursivamente até obter 50 filmes
          } else {
            const remainingMovies = 50 - this.movies.length;
            if (remainingMovies > 0) {
              this.currentPage = 1; // Reinicia a página para buscar os filmes novamente
              this.loadMovies(); // Recarrega os filmes restantes
            }
          }
        }
      },
      (error) => {
        console.error('Error loading movies:', error);
      }
    );
  }
  

  async openMovieModal(movie: any) {
    const movieData = await this.movieService.getSerieById(movie.id, this.language).toPromise();
    const genres = movieData.genres.map((genre: any) => genre.name).join(', ');
    const modal = await this.modalController.create({
      component: MovieModalComponent,
      componentProps: {
        title: movie.name,
        synopsis: movieData.overview,
        genres: genres,
        posterPath: movie.poster_path,
        popularity: movieData.popularity,
        voteAverage: movieData.vote_average,
        voteCount: movieData.vote_count,
        releaseDate: movieData.release_date
      }
    });
    return await modal.present();
  }
}
