import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/providers/auth/authentication.service';
import { Firestore, collection, doc, setDoc } from "@angular/fire/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  regForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public AuthService: AuthenticationService,
    public loadingCtrl: LoadingController,
    public router: Router,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private location: Location) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      name: ["", [
        Validators.required,
      ]],
      email: ["", [
        Validators.required,
        Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"),
        Validators.email,
      ]],
      password: ["", [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}"),
      ]],
    })
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["Ok"]
    });
    await alert.present();
  }

  async signUp() {
    const { email, password, name } = this.regForm.value;

    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {

      try {
        const user = await this.AuthService.registerUser(email, password);
        const userCredential = user.user;

        if (userCredential) {
          await this.firestore.collection('users').doc(userCredential.uid).set({
            id: userCredential.uid,
            name: name,
            email: email
          });

          loading.dismiss();
          this.router.navigate(["/login"]);
        } else {
          loading.dismiss();
          this.showAlert("Erro de registro", "Não foi possível registrar o usuário.");
        }
        
      } catch (error) {
        await loading.dismiss();
        this.showAlert("Ocorreu um erro", "Não foi possível concluir o registro. Tente novamente mais tarde.");
        console.log(error);
      }
    }
  }

  goBack() {
    this.location.back();
  }

}
