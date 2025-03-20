import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-feedback', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './feedback.component.html', 
  styleUrls: ['./feedback.component.scss'] 
} 
)  
export class feedbackComponent implements OnInit {  
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
    viewfeedback(feedback: any): void { 
    console.log('View feedback:', feedback); 
    alert(`Viewing feedback: ${JSON.stringify(feedback, null, 2)}`); 
} 
    updatefeedback(feedback: any): void { 
    this.router.navigate(['/update', 'feedback', feedback._id]); 
  } 
    deletefeedback(feedbackId: string): void { 
    console.log('Delete feedback ID:', feedbackId); 
    this.service.deleteItem('feedback',feedbackId).subscribe(  
       response => { 
           console.log('feedback deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['feedback'] = this.dataMap['feedback'].filter((feedback: any) => feedback._id !== feedbackId); 
           alert('feedback Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting feedback:', error); 
           alert('Failed to delete feedback!'); 
       }  
    ); 
} 
} 
