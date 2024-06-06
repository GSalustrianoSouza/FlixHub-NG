import { TestBed } from '@angular/core/testing';

import { MovieProviderService } from './movie-provider.service';

describe('MovieProviderService', () => {
  let service: MovieProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
