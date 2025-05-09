import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:5000';
  private selectedTechStack: any = null;

  constructor(private http: HttpClient) { }

  setTechStack(techStack: any) {
    this.selectedTechStack = techStack;
  }

  generateProject(dbConfig: any): Observable<any> {
    const projectData = {
      frontend: this.selectedTechStack?.frontend, // Garde "Angular", "React", etc.
      backend: this.selectedTechStack?.backend,   // Garde "Node", "Django", etc.
      DB_URI: dbConfig.host,
      dbName: dbConfig.dbName,
      username: dbConfig.username,
      password: dbConfig.password,
      port: dbConfig.port,
      TypeDB: this.selectedTechStack?.database    // Garde "MySQL", "MongoDB", etc.
    };
    

    console.log('Sending to backend:', projectData);
    console.log('Backend URL:', this.apiUrl);
    
    return this.http.post(this.apiUrl, projectData);
  }
}