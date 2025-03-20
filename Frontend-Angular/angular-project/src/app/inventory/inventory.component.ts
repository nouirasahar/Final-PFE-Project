import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-inventory', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './inventory.component.html', 
  styleUrls: ['./inventory.component.scss'] 
} 
)  
export class inventoryComponent implements OnInit {  
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
    viewinventory(inventory: any): void { 
    console.log('View inventory:', inventory); 
    alert(`Viewing inventory: ${JSON.stringify(inventory, null, 2)}`); 
} 
    updateinventory(inventory: any): void { 
    this.router.navigate(['/update', 'inventory', inventory._id]); 
  } 
    deleteinventory(inventoryId: string): void { 
    console.log('Delete inventory ID:', inventoryId); 
    this.service.deleteItem('inventory',inventoryId).subscribe(  
       response => { 
           console.log('inventory deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['inventory'] = this.dataMap['inventory'].filter((inventory: any) => inventory._id !== inventoryId); 
           alert('inventory Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting inventory:', error); 
           alert('Failed to delete inventory!'); 
       }  
    ); 
} 
} 
