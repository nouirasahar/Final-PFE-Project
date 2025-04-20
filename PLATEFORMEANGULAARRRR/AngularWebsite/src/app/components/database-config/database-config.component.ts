import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-database-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './database-config.component.html',
  styleUrls: ['./database-config.component.css']
})
export class DatabaseConfigComponent implements OnInit {
  dbConfigForm: FormGroup;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.dbConfigForm = this.fb.group({
      host: ['', [Validators.required]],
      port: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      database: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      ssl: [false]
    });
  }

  ngOnInit(): void {
    // Load saved configuration if exists
    const savedConfig = localStorage.getItem('dbConfig');
    if (savedConfig) {
      this.dbConfigForm.patchValue(JSON.parse(savedConfig));
    }
  }

  onSubmit(): void {
    if (this.dbConfigForm.valid) {
      this.connectionStatus = 'connecting';
      // Simulate database connection
      setTimeout(() => {
        // Save configuration
        localStorage.setItem('dbConfig', JSON.stringify(this.dbConfigForm.value));
        this.connectionStatus = 'connected';
        this.errorMessage = '';
      }, 1500);
    } else {
      this.connectionStatus = 'error';
      this.errorMessage = 'Please fill all required fields correctly';
    }
  }

  testConnection(): void {
    if (this.dbConfigForm.valid) {
      this.connectionStatus = 'connecting';
      // Simulate connection test
      setTimeout(() => {
        this.connectionStatus = 'connected';
        this.errorMessage = '';
      }, 1000);
    }
  }

  resetForm(): void {
    this.dbConfigForm.reset();
    this.connectionStatus = 'disconnected';
    this.errorMessage = '';
    localStorage.removeItem('dbConfig');
  }
} 