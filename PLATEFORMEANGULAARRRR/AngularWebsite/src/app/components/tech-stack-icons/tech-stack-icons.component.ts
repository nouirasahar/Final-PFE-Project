import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-stack-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack-icons.component.html',
  styleUrls: ['./tech-stack-icons.component.css']
})
export class TechStackIconsComponent {
  techStack = [
    { name: 'Angular', icon: 'assets/icons/angular.svg' },
    { name: 'TypeScript', icon: 'assets/icons/typescript.svg' },
    { name: 'JavaScript', icon: 'assets/icons/javascript.svg' },
    { name: 'HTML5', icon: 'assets/icons/html5.svg' },
    { name: 'CSS3', icon: 'assets/icons/css3.svg' },
    { name: 'Node.js', icon: 'assets/icons/nodejs.svg' },
    { name: 'React', icon: 'assets/icons/react.svg' },
    { name: 'Vue.js', icon: 'assets/icons/vuejs.svg' }
  ];
} 