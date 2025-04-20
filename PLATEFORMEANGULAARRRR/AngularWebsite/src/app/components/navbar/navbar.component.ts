import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-[#EEF2FF] via-[#F3E8FF] to-[#E0F2FE] shadow-sm">
      <a routerLink="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer no-underline">
        <i class="fas fa-rocket text-[#8B5CF6]"></i>
        <span class="text-2xl font-semibold">DevStart</span>
      </a>
      <div class="flex items-center gap-4">
        <a routerLink="/documentation" class="text-gray-700 hover:text-gray-900 text-base no-underline">Documentation</a>
        <a routerLink="/get-started" class="px-4 py-2 bg-[#8B5CF6] text-white text-base rounded-full hover:bg-[#7C3AED] transition-colors no-underline">
          Get Started
        </a>
      </div>
    </nav>
  `
})
export class NavbarComponent {} 