import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authState = new BehaviorSubject<boolean>(false);
  private userName = new BehaviorSubject<string | null>(null);

  constructor(public ngFireAuth: AngularFireAuth, private firestore: AngularFirestore) { 
    this.ngFireAuth.authState.subscribe(async user => {
      if (user) {
        this.authState.next(true);
        const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();
        if (userDoc?.exists) {
          const userData = userDoc.data() as User;
          this.userName.next(userData.name);
        }
      } else {
        this.authState.next(false);
        this.userName.next(null);
      }
    });
  }

  get isLoggedIn() {
    return this.authState.asObservable();
  }

  get currentUserName() {
    return this.userName.asObservable();
  }

  async registerUser(email: string, password: string) {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  async loginUser(email: string, password: string) {
    const userCredential = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
    if (userCredential.user) {
      const userDoc = await this.firestore.collection('users').doc(userCredential.user.uid).get().toPromise();
      if (userDoc?.exists) {
        const userData = userDoc.data() as User;
        this.userName.next(userData.name);
      }
    }
    this.authState.next(true);
    return userCredential;
  }

  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }

  async signOut() {
    await this.ngFireAuth.signOut();
    this.authState.next(false);
    this.userName.next(null);
  }

  async getProfile() {
    return await this.ngFireAuth.currentUser;
  }

  async getCurrentUserUid(): Promise<string | null> {
    const user = await this.ngFireAuth.currentUser;
    return user ? user.uid : null;
  }

  async getUserName(uid: string): Promise<string | null> {
    try {
      const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
      if (userDoc.exists) {
        const userData = userDoc.data() as User;
        return userData.name;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user name from Firestore:', error);
      return null;
    }
  }
}
