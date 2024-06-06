import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { LastMoviesComponentComponent } from '../components/slides/last-movies-component/last-movies-component.component';
import { MovieProviderService } from '../providers/movie/movie-provider.service';
import { LastSeriesComponentComponent } from '../components/slides/last-series-component/last-series-component.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    LastMoviesComponentComponent,
    LastSeriesComponentComponent
  ],
  declarations: [Tab1Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MovieProviderService]
})
export class Tab1PageModule {}
