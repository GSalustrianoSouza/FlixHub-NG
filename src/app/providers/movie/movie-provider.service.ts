import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieProviderService {

  constructor(public http : HttpClient) { }

  // MÉTODO PARA PEGAR A API KEY DO TMDB
  private getApiKey() : string { //API Key TMDB
    return environment.tmdbApiKey;
  }

  // VARIÁVEIS

  private baseURL : string = "https://api.themoviedb.org/3/";
  private baseURLAnime : string = "https://api.jikan.moe/v4/";

  // MÉTODOS

  // MÉTODO IMPORTANTE!!! RESPONSÁVEL POR BUILDAR A URL DA API
  private buildURL(endpoint: string, params: any): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append('api_key', this.getApiKey());
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url.toString();
  }

  public getVideosByMovieId(movieId: string | number): Observable<any[]> {
    const url = this.buildURL(`movie/${movieId}/videos`, { language: 'pt-BR' });
    return this.http.get<any[]>(url).pipe(
      map((data: any) => {
        if (data && data.results && data.results.length > 0) {
          return data.results;
        } else {
          throw new Error('No video data available.');
        }
      })
    );
  }

  public getLatestMovie(): Observable<any> {
    const url = this.buildURL('movie/latest', { sort_by: 'popularity.desc', language: 'pt-BR' });
    return this.http.get(url);
  }

  public getLatestSerie(): Observable<any> {
    const url = this.buildURL('tv/latest', { sort_by: 'popularity.desc', language: 'pt-BR' });
    return this.http.get(url);
  }
  

  public getTopMovie(page: number = 1) {
    const url = this.buildURL('movie/now_playing', {
      page: page.toString()
    });

    return this.http.get<any[]>(url).pipe(
      map((data: any) => {
        if (data.results && data.results.length > 0) {
          return data.results;
        } else {
          throw new Error('No movie data available.');
        }
      })
    );
  }

  public getTopSerie(page: number = 1): Observable<any[]> {
    const url = this.buildURL('tv/top_rated', {
      page: page.toString(),
    });
  
    return this.http.get<any[]>(url).pipe(
      map((data: any) => {
        if (data.results && data.results.length > 0) {
          return data.results;
        } else {
          throw new Error('No series data available.');
        }
      })
    );
  }
  
  

  public getMovieById(movieId: string | number, language: string): Observable<any> {
    const url = this.buildURL(`movie/${movieId}`, { language: language });
    return this.http.get(url);
  }

  public getSerieById(movieId: string | number, language: string): Observable<any> {
    const url = this.buildURL(`tv/${movieId}`, { language: language });
    return this.http.get(url);
  }

  public getMovieByName(movieName: string): Observable<any[]> {
    const url = this.buildURL('search/movie', { query: movieName, language: 'pt-BR' });
    return this.http.get<any[]>(url);
  }

  public getTopAnime() : Observable<any> {
    return this.http.get<any>(`${this.baseURLAnime}top/anime`).pipe(
      map(response => {
        if (response && response.data && response.data.length > 0) {
          return response.data[0]; // Retorna o primeiro anime da lista
        } else {
          throw new Error('No anime data received.');
        }
      })
    );
  }

  public getTopMoviesByGenre(genreId: string, page: number = 1): Observable<any[]> {
    const url = this.buildURL('discover/movie', {
      page: page.toString(),
      with_genres: genreId,
    });

    return this.http.get<any[]>(url).pipe(
      map((data: any) => {
        if (data.results && data.results.length > 0) {
          return data.results;
        } else {
          throw new Error(`No movies data available for genre ID: ${genreId}.`);
        }
      })
    );
  }
}
