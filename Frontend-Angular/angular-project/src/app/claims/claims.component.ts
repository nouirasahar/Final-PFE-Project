import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-claims', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './claims.component.html', 
  styleUrls: ['./claims.component.scss'] 
} 
)  
export class claimsComponent implements OnInit {  
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
    viewclaims(claims: any): void { 
    console.log('View claims:', claims); 
    alert(`Viewing claims: ${JSON.stringify(claims, null, 2)}`); 
} 
    updateclaims(claims: any): void { 
    this.router.navigate(['/update', 'claims', claims._id]); 
  } 
    deleteclaims(claimsId: string): void { 
    console.log('Delete claims ID:', claimsId); 
    this.service.deleteItem('claims',claimsId).subscribe(  
       response => { 
           console.log('claims deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['claims'] = this.dataMap['claims'].filter((claims: any) => claims._id !== claimsId); 
           alert('claims Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting claims:', error); 
           alert('Failed to delete claims!'); 
       }  
    ); 
} 
} 
