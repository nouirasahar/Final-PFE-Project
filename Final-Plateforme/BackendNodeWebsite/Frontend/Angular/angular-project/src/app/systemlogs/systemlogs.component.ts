import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-systemlogs', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './systemlogs.component.html', 
  styleUrls: ['./systemlogs.component.scss'] 
} 
)  
export class systemlogsComponent implements OnInit {  
  tables: string[] = []; 
  dataMap: any = {}; 
  item: any; 
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
    viewsystemlogs(systemlogs: any): void { 
    console.log('View systemlogs:', systemlogs); 
    alert(`Viewing systemlogs: ${JSON.stringify(systemlogs, null, 2)}`); 
} 
    updatesystemlogs(systemlogs: any): void { 
    this.router.navigate(['/update', 'systemlogs', systemlogs.id]); 
  } 
    deletesystemlogs(systemlogsId: string): void { 
    console.log('Delete systemlogs ID:', systemlogsId); 
    this.service.deleteItem('systemlogs',systemlogsId).subscribe(  
       response => { 
           console.log('systemlogs deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['systemlogs'] = this.dataMap['systemlogs'].filter((systemlogs: any) => systemlogs.id !== systemlogsId); 
           alert('systemlogs Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting systemlogs:', error); 
           alert('Failed to delete systemlogs!'); 
       }  
    ); 
} 
} 
