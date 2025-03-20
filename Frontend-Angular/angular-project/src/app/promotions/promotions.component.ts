import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-promotions', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './promotions.component.html', 
  styleUrls: ['./promotions.component.scss'] 
} 
)  
export class promotionsComponent implements OnInit {  
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
    viewpromotions(promotions: any): void { 
    console.log('View promotions:', promotions); 
    alert(`Viewing promotions: ${JSON.stringify(promotions, null, 2)}`); 
} 
    updatepromotions(promotions: any): void { 
    this.router.navigate(['/update', 'promotions', promotions._id]); 
  } 
    deletepromotions(promotionsId: string): void { 
    console.log('Delete promotions ID:', promotionsId); 
    this.service.deleteItem('promotions',promotionsId).subscribe(  
       response => { 
           console.log('promotions deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['promotions'] = this.dataMap['promotions'].filter((promotions: any) => promotions._id !== promotionsId); 
           alert('promotions Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting promotions:', error); 
           alert('Failed to delete promotions!'); 
       }  
    ); 
} 
} 
