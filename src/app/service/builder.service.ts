import { Injectable } from '@angular/core';
import { Direction } from '../models/direction';
import { SpaceType } from '../models/sapce-type';
declare const SVG: any;

@Injectable()
export class BuilderService {

  private static index = 1;

  constructor() { }

  build(type: SpaceType, canvas: any, x: number, y: number, direction: Direction) {
    switch (type) {
      case (SpaceType.Source) :
        this.buildSource(canvas, x, y, direction, false); break;
      case (SpaceType.SourceRev) :
        this.buildSourceRev(canvas, x, y, direction, false); break;
      case (SpaceType.Resistor) :
        this.buildResistor(canvas, x, y, direction, false); break;
      case (SpaceType.Wire) :
        this.buildWire(canvas, x, y, direction); break;
    }
  }

  buildSource(canvas: any, x: number, y: number, direction: Direction, drawIndex: boolean = true): number {
    if (direction === Direction.Horizontal) {
      canvas.line(x, y + 20, x + 45, y + 20).stroke({ width: 10 });
      canvas.line(x + 45, y, x + 45, y + 40).stroke({ width: 10 });
      canvas.line(x + 60, y + 10, x + 60, y + 30).stroke({ width: 7 });
      canvas.line(x + 60, y + 20, x + 100, y + 20).stroke({ width: 10 });
      if (drawIndex) {
        return this.drawIndex(canvas, x + 50, y - 20);
      }
    } else {
      canvas.line(x + 20, y + 0, x + 20, y + 45).stroke({ width: 10 });
      canvas.line(x + 0, y + 45, x + 40, y + 45).stroke({ width: 10 });
      canvas.line(x + 10, y + 60, x + 30, y + 60).stroke({ width: 7 });
      canvas.line(x + 20, y + 60, x + 20, y + 100).stroke({ width: 10 });
      if (drawIndex) {
        return this.drawIndex(canvas, x + 40, y + 50);
      }
    }
  }

  buildSourceRev(canvas: any, x: number, y: number, direction: Direction, drawIndex: boolean = true): number {
    if (direction === Direction.Horizontal) {
      canvas.line(x + 0, y + 20, x + 40, y + 20).stroke({ width: 10 });
      canvas.line(x + 40, y + 10, x + 40, y + 30).stroke({ width: 7 });
      canvas.line(x + 55, y + 0, x + 55, y + 40).stroke({ width: 10 });
      canvas.line(x + 55, y + 20, x + 100, y + 20).stroke({ width: 10 });
      if (drawIndex) {
        return this.drawIndex(canvas, x + 50, y - 20);
      }
    } else {
      canvas.line(x + 20, y + 0, x + 20, y + 40).stroke({ width: 10 });
      canvas.line(x + 10, y + 40, x + 30, y + 40).stroke({ width: 7 });
      canvas.line(x + 0, y + 55, x + 40, y + 55).stroke({ width: 10 });
      canvas.line(x + 20, y + 55, x + 20, y + 100).stroke({ width: 10 });
      if (drawIndex) {
        return this.drawIndex(canvas, x + 40, y + 50);
      }
    }
  }

  buildResistor(canvas: any, x: number, y: number, direction: Direction, drawIndex: boolean = true): number {
    if (direction === Direction.Horizontal) {
      canvas.rect(60, 40).move(x + 20, y);
      canvas.line(x + 0, y + 20, x + 100, y + 20).stroke({ width: 10 });
      if (drawIndex) {
        return this.drawIndex(canvas, x + 50, y - 20);
      }
    } else {
      canvas.rect(40, 60).move(x, y + 20);
      canvas.line(x + 20, y + 0, x + 20, y + 100).stroke({ width: 10 });
      if (drawIndex) {
        return this.drawIndex(canvas, x + 40, y + 50);
      }
    }
  }

  buildWire(canvas: any, x: number, y: number, direction: Direction): void {
    if (direction === Direction.Horizontal) {
      canvas.line(x + 0, y + 5, x + 100, y + 5).stroke({ width: 10 });
    } else {
      canvas.line(x + 5, y + 0, x + 5, y + 100).stroke({ width: 10});
    }
  }

  private drawIndex(canvas: any, x: number, y: number): number {
    canvas.text(BuilderService.index.toString()).move(x, y);
    BuilderService.index++;
    return BuilderService.index - 1;
  }
}
