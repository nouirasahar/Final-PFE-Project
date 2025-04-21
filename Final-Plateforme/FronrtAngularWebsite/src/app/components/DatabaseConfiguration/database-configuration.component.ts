import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';

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
    host: '',
    port: '',
    dbName: ''  // Changed to dbName to match backend expectations
  };

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}
  
  goBack() {
    this.router.navigate(['/get-started']);
  }
  generateProject() {
    console.log('Sending database config:', this.databaseConfig);
    this.projectService.generateProject(this.databaseConfig).subscribe({
      next: (response) => {
        console.log('Project generation started:', response);
      },
      error: (error) => {
        console.error('Error generating project:', error);
      }
    });
  
    this.router.navigate(['/generate-project']); // navigates immediately
  }
  
}
