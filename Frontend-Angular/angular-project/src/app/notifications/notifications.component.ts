import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-notifications', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './notifications.component.html', 
  styleUrls: ['./notifications.component.scss'] 
} 
)  
export class notificationsComponent implements OnInit {  
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
    viewnotifications(notifications: any): void { 
    console.log('View notifications:', notifications); 
    alert(`Viewing notifications: ${JSON.stringify(notifications, null, 2)}`); 
} 
    updatenotifications(notifications: any): void { 
    this.router.navigate(['/update', 'notifications', notifications._id]); 
  } 
    deletenotifications(notificationsId: string): void { 
    console.log('Delete notifications ID:', notificationsId); 
    this.service.deleteItem('notifications',notificationsId).subscribe(  
       response => { 
           console.log('notifications deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['notifications'] = this.dataMap['notifications'].filter((notifications: any) => notifications._id !== notificationsId); 
           alert('notifications Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting notifications:', error); 
           alert('Failed to delete notifications!'); 
       }  
    ); 
} 
} 
