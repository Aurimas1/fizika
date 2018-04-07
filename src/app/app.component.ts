import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { HorizontalDialogComponent } from './dialogs/horizontal.dialog';
import { Space, Direction } from './models';
import { AppServiceService, SpaceView } from './app-service.service';
declare const SVG: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public items: Array<SpaceView>;
  private canvasSizeX = 460;
  private canvasSizeY = 340;
  private sizeBetweenDots = 100;
  private dotRadius = 20;
  private offset = 20;
  private draw: any;

  constructor(private dialog: MatDialog, private service: AppServiceService) { }

  ngOnInit() {
    this.draw = SVG('canvas').size(this.canvasSizeX, this.canvasSizeY);
    this.service.setCanvas(this.draw);

    const dots = new Array<any>();
    for (let i = 0; i < 20; i++) {
      dots.push(this.draw.circle(this.dotRadius)
        .move(this.offset + this.sizeBetweenDots * (i % 5), this.offset + this.sizeBetweenDots * Math.trunc(i / 5) ));
    }

    for (let i = 0; i < 15; i++) {
      const x = this.offset + this.dotRadius / 2 + this.sizeBetweenDots * (i % 5);
      const y = this.offset + this.dotRadius / 2 + this.sizeBetweenDots * Math.trunc(i / 5);
      const someLine = this.draw.line(x, y, x, y + this.sizeBetweenDots);
      someLine.stroke({width: 5, color: 'red'});
      const space = this.service.createSpace(someLine, x, y, Direction.Vertical, i, i + 5);
      someLine.click(() => this.openDialog(space, Direction.Vertical));
    }

    for (let i = 0; i < 16; i++) {
      const x = this.offset + this.dotRadius / 2 + this.sizeBetweenDots * (i % 4);
      const y = this.offset + this.dotRadius / 2 + this.sizeBetweenDots * Math.trunc(i / 4);
      const someLine = this.draw.line(x, y, x + this.sizeBetweenDots, y);
      someLine.stroke({width: 5, color: 'red'});
      const space = this.service.createSpace(someLine, x, y, Direction.Horizontal, i + Math.trunc(i / 4), i + Math.trunc(i / 4) + 1);
      someLine.click(() => this.openDialog(space, Direction.Horizontal));
    }
  }

  openDialog(space: Space, direction: Direction) {
    const dialogRef = this.dialog.open(HorizontalDialogComponent, {data: {
      space: space,
      direction: direction
    }});
  }

  calculate() {
    this.items = this.service.calculate();
  }
}
