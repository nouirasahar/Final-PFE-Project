import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  icon?: string;
}

@Component({
  selector: 'app-generate-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generate-project.component.html',
  styleUrls: ['./generate-project.component.css']
})
export class GenerateProjectComponent implements OnInit {
  progress = 0;
  currentStep = 0;
  
  steps: Step[] = [
    { title: ' Initializing Project ', status: 'pending' },
    { title: 'Connecting to your Database', status: 'in-progress' },
    { title: 'Configuring  Services', status: 'pending' },
    { title: 'Creating API Endpoints ', status: 'pending' },
    { title: 'Configuring the server', status: 'pending' },
    { title: 'Setting up Frontend Components', status: 'pending' },
    { title: 'Building interfaces', status: 'pending' },
    { title: 'creating the Service', status: 'pending' },
    { title: 'Finalizing Project ', status: 'pending' }
  ];

  features = {
    frontend: {
      title: 'Frontend Features',
      icon: '⚡',
      items: [
        'Components & Pages',
        'Routing Configuration',
        'API Integration'
      ]
    },
    backend: {
      title: 'Backend Features',
      icon: '⚡',
      items: [
        'Connecting to the database',
        'API Endpoints'
      ]
    },
    database: {
      title: 'Database Features',
      icon: '⚡',
      items: [
        'MySQL Support',
        'Mongo Support',
      ]
    }
  };
  

  ngOnInit() {
    this.startGeneration();
  }

  private startGeneration() {
    let step = 0;
    const interval = setInterval(() => {
      if (step < this.steps.length) {
        if (step > 0) {
          this.steps[step - 1].status = 'completed';
        }
        this.steps[step].status = 'in-progress';
        this.progress = Math.round((step / (this.steps.length - 1)) * 100);
        step++;
      } else {
        this.steps[step - 1].status = 'completed';
        this.progress = 100;
        clearInterval(interval);
      }
    }, 2000);
  }

  downloadProject() {
    // Here you would implement the actual download logic
    console.log('Downloading project.zip...');
    // For now, we'll just create a dummy download link
    const link = document.createElement('a');
    link.href = 'path/to/your/project.zip';
    link.download = 'project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}