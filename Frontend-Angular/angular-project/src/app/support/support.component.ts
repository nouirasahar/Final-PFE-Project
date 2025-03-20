import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-support', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './support.component.html', 
  styleUrls: ['./support.component.scss'] 
} 
)  
export class supportComponent implements OnInit {  
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
    viewsupport(support: any): void { 
    console.log('View support:', support); 
    alert(`Viewing support: ${JSON.stringify(support, null, 2)}`); 
} 
    updatesupport(support: any): void { 
    this.router.navigate(['/update', 'support', support._id]); 
  } 
    deletesupport(supportId: string): void { 
    console.log('Delete support ID:', supportId); 
    this.service.deleteItem('support',supportId).subscribe(  
       response => { 
           console.log('support deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['support'] = this.dataMap['support'].filter((support: any) => support._id !== supportId); 
           alert('support Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting support:', error); 
           alert('Failed to delete support!'); 
       }  
    ); 
} 
} 
