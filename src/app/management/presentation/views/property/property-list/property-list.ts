import {AfterViewChecked, Component, computed, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatError} from '@angular/material/form-field';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {TranslatePipe} from '@ngx-translate/core';

import {ManagementStore} from '../../../../application/management-store';

@Component({
  selector: 'app-property-list',
  imports: [MatTableModule, MatButtonModule, MatError, MatProgressSpinner, MatIcon, MatPaginator, MatSort, MatSortHeader, TranslatePipe],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css',
})
export class PropertyList implements AfterViewChecked {
  readonly store = inject(ManagementStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'name', 'address', 'type', 'spaces', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.properties());
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  openProperty(id: number) {
    this.router.navigate(['/management/properties', id]);
  }

  navigateToNew() {
    this.router.navigate(['/management/properties/new']);
  }

  ngAfterViewChecked() {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}
