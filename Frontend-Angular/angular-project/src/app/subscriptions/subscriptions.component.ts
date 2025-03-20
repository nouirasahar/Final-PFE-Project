import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-subscriptions', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './subscriptions.component.html', 
  styleUrls: ['./subscriptions.component.scss'] 
} 
)  
export class subscriptionsComponent implements OnInit {  
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
    viewsubscriptions(subscriptions: any): void { 
    console.log('View subscriptions:', subscriptions); 
    alert(`Viewing subscriptions: ${JSON.stringify(subscriptions, null, 2)}`); 
} 
    updatesubscriptions(subscriptions: any): void { 
    this.router.navigate(['/update', 'subscriptions', subscriptions._id]); 
  } 
    deletesubscriptions(subscriptionsId: string): void { 
    console.log('Delete subscriptions ID:', subscriptionsId); 
    this.service.deleteItem('subscriptions',subscriptionsId).subscribe(  
       response => { 
           console.log('subscriptions deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['subscriptions'] = this.dataMap['subscriptions'].filter((subscriptions: any) => subscriptions._id !== subscriptionsId); 
           alert('subscriptions Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting subscriptions:', error); 
           alert('Failed to delete subscriptions!'); 
       }  
    ); 
} 
} 
