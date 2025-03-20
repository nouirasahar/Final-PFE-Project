import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-history', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './history.component.html', 
  styleUrls: ['./history.component.scss'] 
} 
)  
export class historyComponent implements OnInit {  
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
    viewhistory(history: any): void { 
    console.log('View history:', history); 
    alert(`Viewing history: ${JSON.stringify(history, null, 2)}`); 
} 
    updatehistory(history: any): void { 
    this.router.navigate(['/update', 'history', history._id]); 
  } 
    deletehistory(historyId: string): void { 
    console.log('Delete history ID:', historyId); 
    this.service.deleteItem('history',historyId).subscribe(  
       response => { 
           console.log('history deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['history'] = this.dataMap['history'].filter((history: any) => history._id !== historyId); 
           alert('history Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting history:', error); 
           alert('Failed to delete history!'); 
       }  
    ); 
} 
} 
