import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-settings', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './settings.component.html', 
  styleUrls: ['./settings.component.scss'] 
} 
)  
export class settingsComponent implements OnInit {  
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
    viewsettings(settings: any): void { 
    console.log('View settings:', settings); 
    alert(`Viewing settings: ${JSON.stringify(settings, null, 2)}`); 
} 
    updatesettings(settings: any): void { 
    this.router.navigate(['/update', 'settings', settings._id]); 
  } 
    deletesettings(settingsId: string): void { 
    console.log('Delete settings ID:', settingsId); 
    this.service.deleteItem('settings',settingsId).subscribe(  
       response => { 
           console.log('settings deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['settings'] = this.dataMap['settings'].filter((settings: any) => settings._id !== settingsId); 
           alert('settings Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting settings:', error); 
           alert('Failed to delete settings!'); 
       }  
    ); 
} 
} 
