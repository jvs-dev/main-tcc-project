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
  dataKeys: string[] = []

  ngOnInit() {
    this.data().result.forEach((element: any, index: number) => (      
      this.dataKeys.push(Object.keys(this.data().result[index])[0])
      
    ));
    console.log(this.dataKeys);

  }
}