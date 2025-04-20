import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-database-configuration',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './database-configuration.component.html',
  styleUrls: ['./database-configuration.component.css']
})
export class DatabaseConfigurationComponent {
  databaseConfig = {
    username: '',
    password: '',
    host: 'localhost',
    port: '27017',
    databaseName: ''
  };

  constructor(private router: Router) {}
  
  goBack() {
    this.router.navigate(['/get-started']);
  }
  
  generateProject() {
    console.log('Generating project with config:', this.databaseConfig);
    this.router.navigate(['/generate-project']);
  }
}
