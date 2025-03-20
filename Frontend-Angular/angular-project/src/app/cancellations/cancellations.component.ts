import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-cancellations', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './cancellations.component.html', 
  styleUrls: ['./cancellations.component.scss'] 
} 
)  
export class cancellationsComponent implements OnInit {  
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
    viewcancellations(cancellations: any): void { 
    console.log('View cancellations:', cancellations); 
    alert(`Viewing cancellations: ${JSON.stringify(cancellations, null, 2)}`); 
} 
    updatecancellations(cancellations: any): void { 
    this.router.navigate(['/update', 'cancellations', cancellations._id]); 
  } 
    deletecancellations(cancellationsId: string): void { 
    console.log('Delete cancellations ID:', cancellationsId); 
    this.service.deleteItem('cancellations',cancellationsId).subscribe(  
       response => { 
           console.log('cancellations deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['cancellations'] = this.dataMap['cancellations'].filter((cancellations: any) => cancellations._id !== cancellationsId); 
           alert('cancellations Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting cancellations:', error); 
           alert('Failed to delete cancellations!'); 
       }  
    ); 
} 
} 
