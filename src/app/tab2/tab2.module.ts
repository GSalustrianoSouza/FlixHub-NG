import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { TerrorComponent } from '../components/category/terror/terror.component';
import { MovieProviderService } from '../providers/movie/movie-provider.service';
import { ActionComponent } from '../components/category/action/action.component';
import { AdventureComponent } from '../components/category/adventure/adventure.component';
import { FictionComponent } from '../components/category/fiction/fiction.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    TerrorComponent,
    ActionComponent,
    AdventureComponent,
    FictionComponent
  ],
  declarations: [Tab2Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MovieProviderService]
})
export class Tab2PageModule {}
