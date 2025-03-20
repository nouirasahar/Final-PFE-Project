import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-engagements', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './engagements.component.html', 
  styleUrls: ['./engagements.component.scss'] 
} 
)  
export class engagementsComponent implements OnInit {  
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
    viewengagements(engagements: any): void { 
    console.log('View engagements:', engagements); 
    alert(`Viewing engagements: ${JSON.stringify(engagements, null, 2)}`); 
} 
    updateengagements(engagements: any): void { 
    this.router.navigate(['/update', 'engagements', engagements._id]); 
  } 
    deleteengagements(engagementsId: string): void { 
    console.log('Delete engagements ID:', engagementsId); 
    this.service.deleteItem('engagements',engagementsId).subscribe(  
       response => { 
           console.log('engagements deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['engagements'] = this.dataMap['engagements'].filter((engagements: any) => engagements._id !== engagementsId); 
           alert('engagements Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting engagements:', error); 
           alert('Failed to delete engagements!'); 
       }  
    ); 
} 
} 
