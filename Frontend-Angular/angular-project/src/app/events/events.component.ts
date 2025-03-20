import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-events', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './events.component.html', 
  styleUrls: ['./events.component.scss'] 
} 
)  
export class eventsComponent implements OnInit {  
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
    viewevents(events: any): void { 
    console.log('View events:', events); 
    alert(`Viewing events: ${JSON.stringify(events, null, 2)}`); 
} 
    updateevents(events: any): void { 
    this.router.navigate(['/update', 'events', events._id]); 
  } 
    deleteevents(eventsId: string): void { 
    console.log('Delete events ID:', eventsId); 
    this.service.deleteItem('events',eventsId).subscribe(  
       response => { 
           console.log('events deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['events'] = this.dataMap['events'].filter((events: any) => events._id !== eventsId); 
           alert('events Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting events:', error); 
           alert('Failed to delete events!'); 
       }  
    ); 
} 
} 
