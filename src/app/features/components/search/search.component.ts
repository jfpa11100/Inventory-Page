import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  searchTerm = '';
  sortOrder: string = '';
  category: string = '';
  @Output() search = new EventEmitter();
  @Output() filterChange = new EventEmitter<{ sortOrder: string, category: string }>();

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  onFilterChange() {
    this.filterChange.emit({ sortOrder: this.sortOrder, category: this.category });
  }


  onResetFilters() {
    this.search.emit('');
  }
  
}
