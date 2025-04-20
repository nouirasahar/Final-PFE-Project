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
      description: 'A JavaScript library for building interactive UIs',
      icon: 'react.png',
      id: 'react'
    },
    {
      name: 'Angular',
      description: 'A TypeScript-based framework for building web apps',
      icon: 'angular.png',
      id: 'angular'
    },
    {
      name: 'Vue.js',
      description: 'A progressive framework for building UIs with ease',
      icon: 'vuejs.png',
      id: 'vue'
    }
  ];
  
  backendOptions = [
    {
      name: 'Express.js',
      description: 'A minimal Node.js framework for building APIs',
      icon: 'node.png',
      id: 'express'
    },
    {
      name: 'Spring Boot',
      description: 'A Java framework for building production-ready apps',
      icon: 'springboot.png',
      id: 'spring'
    },
    {
      name: 'Django',
      description: 'A Python framework for rapid backend development',
      icon: 'django.png',
      id: 'django'
    }
  ];
  
  databaseOptions = [
    {
      name: 'PostgreSQL',
      description: 'An advanced open-source relational database',
      icon: 'postgresql.png',
      id: 'postgresql'
    },
    {
      name: 'MongoDB',
      description: 'A flexible NoSQL database using JSON-like documents',
      icon: 'mongo.png',
      id: 'mongodb'
    },
    {
      name: 'MySQL',
      description: 'A widely-used open-source relational database',
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
