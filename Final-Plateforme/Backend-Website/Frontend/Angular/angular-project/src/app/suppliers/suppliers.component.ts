import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-suppliers', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './suppliers.component.html', 
  styleUrls: ['./suppliers.component.scss'] 
} 
)  
export class suppliersComponent implements OnInit {  
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
    viewsuppliers(suppliers: any): void { 
    console.log('View suppliers:', suppliers); 
    alert(`Viewing suppliers: ${JSON.stringify(suppliers, null, 2)}`); 
} 
    updatesuppliers(suppliers: any): void { 
    this.router.navigate(['/update', 'suppliers', suppliers.id]); 
  } 
    deletesuppliers(suppliersId: string): void { 
    console.log('Delete suppliers ID:', suppliersId); 
    this.service.deleteItem('suppliers',suppliersId).subscribe(  
       response => { 
           console.log('suppliers deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['suppliers'] = this.dataMap['suppliers'].filter((suppliers: any) => suppliers.id !== suppliersId); 
           alert('suppliers Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting suppliers:', error); 
           alert('Failed to delete suppliers!'); 
       }  
    ); 
} 
} 
