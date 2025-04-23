import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Footer component that displays site navigation and copyright information
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  /** Current year for copyright notice */
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }
}
