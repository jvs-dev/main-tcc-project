import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  data = input<any>(); 

  ngOnInit() {
    this.data().result.forEach((element: any, index: number) => {      
      console.log(Object.keys(this.data().result[index]));      
    });    
  }
}