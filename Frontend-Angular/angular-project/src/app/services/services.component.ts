import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-services', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './services.component.html', 
  styleUrls: ['./services.component.scss'] 
} 
)  
export class servicesComponent implements OnInit {  
  tables: string[] = []; 
  dataMap: any = {}; 
  constructor(private service: SharedService, private router: Router) {} 
  ngOnInit(): void { 
      this.service.getUsers().subscribe(data => { 
      console.log("Données reçues:", data ); 
      if (data && typeof data === "object") { 
        this.tables = Object.keys(data); 
        this.dataMap = data; 
        } else { 
          this.tables = [];  
          this.dataMap = {};   
        }  
      }  
      );  
    }  
//get columns for the table dynamically  
    getColumns(table: string): string[] { 
        return this.dataMap[table] && this.dataMap[table].length > 0  
          ? Object.keys(this.dataMap[table][0]) : []; 
    } 
 // Get the values of a row dynamically  
    getValues(row: any): any[] {  
      return Object.values(row);  
  }  
// New Methods for the Buttons 
    viewservices(services: any): void { 
    console.log('View services:', services); 
    alert(`Viewing services: ${JSON.stringify(services, null, 2)}`); 
} 
    updateservices(services: any): void { 
    this.router.navigate(['/update', 'services', services._id]); 
  } 
    deleteservices(servicesId: string): void { 
    console.log('Delete services ID:', servicesId); 
    this.service.deleteItem('services',servicesId).subscribe(  
       response => { 
           console.log('services deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['services'] = this.dataMap['services'].filter((services: any) => services._id !== servicesId); 
           alert('services Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting services:', error); 
           alert('Failed to delete services!'); 
       }  
    ); 
} 
} 
