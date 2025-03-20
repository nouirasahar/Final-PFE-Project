import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-discounts', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './discounts.component.html', 
  styleUrls: ['./discounts.component.scss'] 
} 
)  
export class discountsComponent implements OnInit {  
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
    viewdiscounts(discounts: any): void { 
    console.log('View discounts:', discounts); 
    alert(`Viewing discounts: ${JSON.stringify(discounts, null, 2)}`); 
} 
    updatediscounts(discounts: any): void { 
    this.router.navigate(['/update', 'discounts', discounts._id]); 
  } 
    deletediscounts(discountsId: string): void { 
    console.log('Delete discounts ID:', discountsId); 
    this.service.deleteItem('discounts',discountsId).subscribe(  
       response => { 
           console.log('discounts deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['discounts'] = this.dataMap['discounts'].filter((discounts: any) => discounts._id !== discountsId); 
           alert('discounts Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting discounts:', error); 
           alert('Failed to delete discounts!'); 
       }  
    ); 
} 
} 
