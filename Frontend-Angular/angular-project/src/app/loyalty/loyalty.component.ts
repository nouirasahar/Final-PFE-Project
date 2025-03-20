import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-loyalty', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './loyalty.component.html', 
  styleUrls: ['./loyalty.component.scss'] 
} 
)  
export class loyaltyComponent implements OnInit {  
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
    viewloyalty(loyalty: any): void { 
    console.log('View loyalty:', loyalty); 
    alert(`Viewing loyalty: ${JSON.stringify(loyalty, null, 2)}`); 
} 
    updateloyalty(loyalty: any): void { 
    this.router.navigate(['/update', 'loyalty', loyalty._id]); 
  } 
    deleteloyalty(loyaltyId: string): void { 
    console.log('Delete loyalty ID:', loyaltyId); 
    this.service.deleteItem('loyalty',loyaltyId).subscribe(  
       response => { 
           console.log('loyalty deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['loyalty'] = this.dataMap['loyalty'].filter((loyalty: any) => loyalty._id !== loyaltyId); 
           alert('loyalty Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting loyalty:', error); 
           alert('Failed to delete loyalty!'); 
       }  
    ); 
} 
} 
