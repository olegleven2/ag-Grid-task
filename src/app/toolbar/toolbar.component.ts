import { Component } from '@angular/core';
import { ColDef, IToolPanelParams } from 'ag-grid-community';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  private params: IToolPanelParams;
  private columnsDef: ColDef[] = [];
  private isSelectedMode: boolean;
  totalAmount = 0;
  selectedAmount = 0;

  agInit(params: IToolPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('modelUpdated', this.updateModel.bind(this));
    this.params.api.addEventListener('rowSelected', this.updateSelectedRowsCount.bind(this));
  }

  toggleMode(): void {
    const checkboxColumnDef = { headerCheckboxSelection: true, checkboxSelection: true, width: 50, pinned: true };
    if (this.params.api.getColumnDef('thumbnails')) {
      this.columnsDef = [
        this.params.api.getColumnDef('thumbnails'),
        this.params.api.getColumnDef('publishedAt'),
        this.params.api.getColumnDef('title'),
        this.params.api.getColumnDef('description')
      ];
    }
    this.isSelectedMode = !this.isSelectedMode;
    if (this.isSelectedMode) {
      this.columnsDef.unshift(checkboxColumnDef);
    } else {
      this.columnsDef.splice(0, 1);
    }
    this.params.api.setColumnDefs(this.columnsDef);
  }

  updateModel(): void {
    this.totalAmount = this.params.api.getDisplayedRowCount();
  }

  updateSelectedRowsCount(): void {
    this.selectedAmount = this.params.api.getSelectedNodes().length;
  }
}
