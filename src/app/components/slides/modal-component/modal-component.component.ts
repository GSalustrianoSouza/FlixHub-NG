import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonSkeletonText, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonRow, IonCol, IonModal } from "@ionic/angular/standalone";

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss'],
  standalone: true,
  imports: [IonModal, IonCol, IonRow, CommonModule, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonSkeletonText, IonCard, IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader]
})

export class MovieModalComponent {
  @Input() title!: string;
  @Input() synopsis!: string;
  @Input() genres!: string;
  @Input() posterPath!: string;
  @Input() popularity!: number;
  @Input() voteAverage!: number;
  @Input() voteCount!: number;
  @Input() releaseDate!: string;
  @Input() movieId!: string;

  constructor(private modalController: ModalController) { }
  
  public formatReleaseDate(releaseDate: string): string {
    const date = new Date(releaseDate);
    const options: any = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
