import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/providers/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public AuthService: AuthenticationService, public loadingCtrl: LoadingController, public router: Router, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
      ]],
      password: ["", [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
      ]]
    })
  }

  get errorControl() {
    return this.loginForm?.controls;
  }

  async signIn() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.loginForm.valid) {
      try {
        const user = await this.AuthService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
        if (user) {
          await loading.dismiss();
          this.router.navigate(["/"]);
        } else {
          await loading.dismiss();
          this.showAlert("Erro", "Credenciais inválidas. Por favor, tente novamente.");
        }
      } catch (error) {
        await loading.dismiss();
        this.showAlert("Erro", "Ocorreu um erro ao tentar logar: " + error.message);
      }
    } else {
      await loading.dismiss();
      this.showAlert("Erro", "Por favor, forneça valores válidos.");
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });
    await alert.present();
  }

}
