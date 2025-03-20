import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-reviews', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './reviews.component.html', 
  styleUrls: ['./reviews.component.scss'] 
} 
)  
export class reviewsComponent implements OnInit {  
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
    viewreviews(reviews: any): void { 
    console.log('View reviews:', reviews); 
    alert(`Viewing reviews: ${JSON.stringify(reviews, null, 2)}`); 
} 
    updatereviews(reviews: any): void { 
    this.router.navigate(['/update', 'reviews', reviews._id]); 
  } 
    deletereviews(reviewsId: string): void { 
    console.log('Delete reviews ID:', reviewsId); 
    this.service.deleteItem('reviews',reviewsId).subscribe(  
       response => { 
           console.log('reviews deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['reviews'] = this.dataMap['reviews'].filter((reviews: any) => reviews._id !== reviewsId); 
           alert('reviews Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting reviews:', error); 
           alert('Failed to delete reviews!'); 
       }  
    ); 
} 
} 
