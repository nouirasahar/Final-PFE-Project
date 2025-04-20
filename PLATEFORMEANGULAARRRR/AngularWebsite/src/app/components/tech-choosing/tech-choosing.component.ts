import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tech-choosing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tech-choosing.component.html',
  styleUrls: ['./tech-choosing.component.css']
})
export class TechChoosingComponent {
  selectedFrontend: any = null;
  selectedBackend: any = null;
  selectedDatabase: any = null;

  constructor(private router: Router) {}
  frontendOptions = [
    {
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      icon: 'react.png',
      id: 'react'
    },
    {
      name: 'Angular',
      description: 'A platform for building web applications',
      icon: 'angular.png',
      id: 'angular'
    },
    {
      name: 'Vue.js',
      description: 'A progressive framework for building user interfaces',
      icon: 'vuejs.png',
      id: 'vue'
    }
  ];

  backendOptions = [
    {
      name: 'Express.js',
      description: 'A minimal and flexible Node.js web application framework',
      icon: 'node.png',
      id: 'express'
    },
    {
      name: 'Spring Boot',
      description: 'A powerful framework for creating robust applications',
      icon: 'springboot.png',
      id: 'spring'
    },
    {
      name: 'Django',
      description: 'A high-level Python web framework',
      icon: 'django.png',
      id: 'django'
    }
  ];

  databaseOptions = [
    {
      name: 'PostgreSQL',
      description: 'A powerful, open source object-relational database system',
      icon: 'postgresql.png',
      id: 'postgresql'
    },
    {
      name: 'MongoDB',
      description: 'A document-oriented NoSQL database',
      icon: 'mongo.png',
      id: 'mongodb'
    },
    {
      name: 'MySQL',
      description: 'A popular open-source relational database management system',
      icon: 'mysql.png',
      id: 'mysql'
    }
  ];

  selectFrontend(option: any) {
    this.selectedFrontend = option;
  }

  selectBackend(option: any) {
    this.selectedBackend = option;
  }

  selectDatabase(option: any) {
    this.selectedDatabase = option;
  }

  continueToConfig() {
    if (this.selectedDatabase) {
      this.router.navigate(['/database-configuration'], {
        queryParams: {
          frontend: this.selectedFrontend?.id,
          backend: this.selectedBackend?.id,
          database: this.selectedDatabase?.id
        }
      });
    }
  }
}
