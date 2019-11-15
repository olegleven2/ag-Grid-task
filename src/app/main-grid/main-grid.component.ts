import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../services/api.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import * as moment from 'moment';

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.scss']
})
export class MainGridComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  public rowData = [];
  gridOptions: GridOptions;

  constructor( private apiService: ApiService ) { }

  ngOnInit() {
    this.initGrid();
    this.getData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  adaptDataForGrid(items) {
    this.rowData = items.map(item => {
      return {
        thumbnails: item.snippet.thumbnails.default,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        title: {
          title: item.snippet.title,
          videoId: item.id.videoId,
        },
      };
    });
  }

  onGridReady() {
    this.gridOptions.api.sizeColumnsToFit();
  }

  private getContextMenuItems(params) {
    if (params.value && params.value.videoId) {
      return [...params.defaultItems, {
        name: 'Open in new tab',
        action: () => { open(`https://www.youtube.com/watch?v=${params.value.videoId}`, '_blank'); }
      }];
    } else {
      return params.defaultItems;
    }
  }

  private imageRender(params): string {
    return `<img src='${params.value.url}' width='${params.value.width}' height='${params.value.height}'>`;
  }

  private urlRender(params): string {
    return `<a href='${`https://www.youtube.com/watch?v=${params.value.videoId}`}' target="_blank">${params.value.title}</a>`;
  }

  private timeRender(params): string {
    return moment().format('llll');
  }

  private getData() {
    this.apiService.getTableData().pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      if (res && res.items) this.adaptDataForGrid(res.items);
    }, err => console.log(err));
  }

  private initGrid() {
    this.gridOptions = {
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      },
      sideBar: {
        toolPanels: [
          {
            id: 'customStats',
            labelDefault: 'Toolbar',
            labelKey: 'customStats',
            iconKey: 'custom-stats',
            toolPanel: 'customStatsToolPanel',
           toolPanelParams: {

           }
          }
        ],
      },
      frameworkComponents: {
        customStatsToolPanel: ToolbarComponent,
        agColumnHeader: HeaderComponent
      },
      icons: { 'custom-stats': '<span class="ag-icon"></span>' },
      rowMultiSelectWithClick: true,
      rowSelection: 'multiple',
      rowClass: 'grid-row',

      columnDefs: [
        { headerName: '', field: 'thumbnails', cellRenderer: this.imageRender, width: 170},
        { headerName: 'Published on', field: 'publishedAt', cellRenderer: this.timeRender, width: 300, cellClass: 'grid-cell' },
        { headerName: 'Video Title', field: 'title', resizable: true, cellRenderer: this.urlRender, width: 310, cellClass: 'grid-cell'},
        { headerName: 'Description', field: 'description', resizable: true, width: 360, cellClass: 'grid-cell'}
      ],

      getRowHeight: params => {
        return params.data.thumbnails.height;
      },
      getContextMenuItems: this.getContextMenuItems,
    };
  }
}
