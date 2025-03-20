import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-plans', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './plans.component.html', 
  styleUrls: ['./plans.component.scss'] 
} 
)  
export class plansComponent implements OnInit {  
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
    viewplans(plans: any): void { 
    console.log('View plans:', plans); 
    alert(`Viewing plans: ${JSON.stringify(plans, null, 2)}`); 
} 
    updateplans(plans: any): void { 
    this.router.navigate(['/update', 'plans', plans._id]); 
  } 
    deleteplans(plansId: string): void { 
    console.log('Delete plans ID:', plansId); 
    this.service.deleteItem('plans',plansId).subscribe(  
       response => { 
           console.log('plans deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['plans'] = this.dataMap['plans'].filter((plans: any) => plans._id !== plansId); 
           alert('plans Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting plans:', error); 
           alert('Failed to delete plans!'); 
       }  
    ); 
} 
} 
