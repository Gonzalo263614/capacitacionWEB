import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  private apiUrl = 'http://localhost:3000/profile'; // Cambia esto a la URL correcta de tu backend

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(this.apiUrl, { headers: { 'Authorization': `Bearer ${token}` } }).subscribe(
        (response: any) => {
          this.user = response;
        },
        error => {
          console.error('Error fetching user profile', error);
        }
      );
    }
  }
}
