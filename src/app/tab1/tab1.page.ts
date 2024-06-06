import { Component, OnInit } from '@angular/core';
import { MovieProviderService } from '../providers/movie/movie-provider.service';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../providers/auth/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [MovieProviderService],
})

export class Tab1Page implements OnInit {
  movieBannerUrl: string;
  movieTitle: string;
  movieGenres: string;
  fallbackBannerUrl: string = 'https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png';
  isLoggedIn: boolean = false;
  userName: string | null = null;

  constructor(private movieService: MovieProviderService, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUserName.subscribe(name => {
      this.userName = name;
    });

    this.loadTopMovie();
  }

  loadTopMovie(): void {
    this.movieService.getTopMovie(1).subscribe(movies => {
      if (movies && movies.length > 0) {
        const movie = movies[0];
        this.movieTitle = movie.title;

        this.movieService.getMovieById(movie.id, 'pt-BR').subscribe(movieData => {
          this.movieGenres = movieData.genres.map((genre: any) => genre.name).join(', ');
          if (movieData.backdrop_path) {
            this.movieBannerUrl = `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`;
          } else {
            console.error('Backdrop path not found for the movie. Using fallback banner.');
            this.movieBannerUrl = this.fallbackBannerUrl;
          }
        }, error => {
          console.error('Erro ao buscar detalhes do filme:', error);
          this.movieBannerUrl = this.fallbackBannerUrl;
        });
      }
    }, error => {
      console.error('Erro ao buscar o filme:', error);
      this.movieBannerUrl = this.fallbackBannerUrl;
    });
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(["/login"]);
  }

}
