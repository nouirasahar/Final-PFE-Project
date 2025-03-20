import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-branches', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './branches.component.html', 
  styleUrls: ['./branches.component.scss'] 
} 
)  
export class branchesComponent implements OnInit {  
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
    viewbranches(branches: any): void { 
    console.log('View branches:', branches); 
    alert(`Viewing branches: ${JSON.stringify(branches, null, 2)}`); 
} 
    updatebranches(branches: any): void { 
    this.router.navigate(['/update', 'branches', branches._id]); 
  } 
    deletebranches(branchesId: string): void { 
    console.log('Delete branches ID:', branchesId); 
    this.service.deleteItem('branches',branchesId).subscribe(  
       response => { 
           console.log('branches deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['branches'] = this.dataMap['branches'].filter((branches: any) => branches._id !== branchesId); 
           alert('branches Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting branches:', error); 
           alert('Failed to delete branches!'); 
       }  
    ); 
} 
} 
