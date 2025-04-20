import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-icon" [ngClass]="icon">
      @switch (icon) {
        @case ('code') {
          <i class="fas fa-code"></i>
        }
        @case ('database') {
          <i class="fas fa-database"></i>
        }
        @case ('layers') {
          <i class="fas fa-layers"></i>
        }
        @case ('rocket') {
          <i class="fas fa-rocket"></i>
        }
      }
    </div>
  `,
  styles: [`
    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    .code {
      background-color: #EEF2FF;
      color: #6366F1;
    }
    .database {
      background-color: #F0FDF4;
      color: #22C55E;
    }
    .layers {
      background-color: #FDF2F8;
      color: #EC4899;
    }
    .rocket {
      background-color: #FEF3C7;
      color: #F59E0B;
    }
  `]
})
export class FeatureIconComponent {
  @Input() icon: string = '';
}
