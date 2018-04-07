import { Injectable } from '@angular/core';
import { Space, Direction, Wire, SpaceType, Resistor, Source, SourceRev } from './models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LinearHelper } from './linear';

@Injectable()
export class AppServiceService {

  private canvas: any;

  private spaces = new Array<Space>();

  private elements = new BehaviorSubject<Array<any>>([]);

  constructor() { }

  setCanvas(canvas: any) {
    this.canvas = canvas;
  }

  createSpace(space: any, x: number, y: number, direction: Direction, dotA: number, dotB: number): Space {
    const spaceToAdd = new Space (space, x, y, direction, [dotA, dotB]);
    this.spaces.push(spaceToAdd);
    return spaceToAdd;
  }

  changeSpace(space: Space, type: SpaceType, resistance?: number, voltige?: number) {
    space.instance.hide();
    if (type === SpaceType.Wire) {
      space.newInstance = new Wire(this.canvas, space);
    } else if (type === SpaceType.Resistor) {
      space.newInstance = new Resistor(this.canvas, space, resistance);
    } else if (type === SpaceType.Source) {
      space.newInstance = new Source(this.canvas, space, resistance, voltige);
    } else if (type === SpaceType.SourceRev) {
      space.newInstance = new SourceRev(this.canvas, space, resistance, voltige);
    }
    this.elements.next(this.elements.value.concat(space.newInstance));
  }

  getElements(): Observable<Array<any>> {
    return this.elements.asObservable();
  }

  lineOptimizations(spaces: Space[]): Space[] {

    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i].newInstance.type === SpaceType.Wire) {
        const min = Math.min(...spaces[i].dots);
        const max = Math.max(...spaces[i].dots);
        for (let j = 0; j < spaces.length; j++) {
          const index = spaces[j].dots.indexOf(max);
          if (index !== -1) {
            spaces[j].dots = spaces[j].dots.map(x => x === max ? min : x);
          }
        }
      }
    }

    return spaces.filter(x => x.newInstance.type !== SpaceType.Wire);
  }

  calculate(): Array<SpaceView> {
    const intrestingElements = this.lineOptimizations(this.spaces.filter(x => x.newInstance));
    const paths = this.allPaths(intrestingElements, intrestingElements[0].dots[0]);
    const stream = this.makeMatrix(paths, intrestingElements);

    const result = new Array<SpaceView>(intrestingElements.length);
    for (let i = 0; i < intrestingElements.length; i++) {
      result[i] = new SpaceView(intrestingElements[i].newInstance.type,
                                intrestingElements[i].newInstance.resistance,
                                stream[i],
                                intrestingElements[i].newInstance.index,
                                intrestingElements[i].newInstance.voltage);
    }
    return result;
  }

  private findEdgedSpaces(arr: Space[], dot: number): Space[] {
    const result = new Array<Space>();
      for (const element of arr) {
        if (element.dots.indexOf(dot) !== -1) {
          result.push(element);
        }
      }
    return result;
  }

  private allPathsFound(arr: SpaceHelper[]): boolean {
    return !arr.map(x => x.waitingSpaces).find(x => x.length !== 0);
  }

  private allPaths(arr: Space[], pointToStart: number): Array<Array<Space>> {
    const posibleStartPoints = this.findEdgedSpaces(arr, pointToStart);

    let helperArray = new Array<SpaceHelper>();
    helperArray.push(
      new SpaceHelper(
        [posibleStartPoints[0]],
        arr.filter(x => x !== posibleStartPoints[0]),
        posibleStartPoints[0].dots.find(x => x !== pointToStart)
      ));
    const result = new Array<Space[]>();
    while (!this.allPathsFound(helperArray)) {
      const newPaths = new Array<SpaceHelper>();
      for (const element of helperArray) {
        const something = helperArray;
        const edges = this.findEdgedSpaces(element.waitingSpaces, element.nextPoint);
        for (const edge of edges) {
          const nextPoint = edge.dots.find(x => x !== element.nextPoint);
          if (nextPoint === pointToStart) {
            result.push(element.chain.concat(edge));
          } else {
            newPaths.push(
              new SpaceHelper(
                element.chain.concat(edge),
                element.waitingSpaces.filter(x => x !== edge),
                nextPoint
              )
            );
          }
        }
      }
      helperArray = newPaths;
    }

    return result;
  }

  private generateSequenceFromPath(path: Space[]): boolean[] {
    const sequence = new Array<number>(path.length + 1);
    sequence[0] = Math.min(...path[0].dots);
    sequence[1] = Math.max(...path[0].dots);

    if (path[1].dots.find(x => x !== sequence[1])) {
      const temp = sequence[0];
      sequence[0] = sequence[1];
      sequence[1] = temp;
    }

    for (let i = 1; i < path.length - 1; i++) {
      sequence[i + 1] = path[i].dots.find(x => x !== sequence[i]);
    }

    sequence[path.length] = sequence[0];

    const result = new Array<boolean>(path.length);

    for (let i = 0; i < path.length; i++) {
      result[i] = sequence[i + 1] - sequence[i] > 0;
    }

    return result;
  }

  private getMultiplier(hasBiggerDot: boolean, space: Space): number {
    let result = 1;
    if (hasBiggerDot) {
      result *= -1;
    }
    if (space.newInstance.type === SpaceType.SourceRev) {
      result *= -1;
    }
    return result;
  }

  private addVoltage(curr: Space, hasBiggerDot: boolean): number {
    if (curr.newInstance.type === SpaceType.Source || curr.newInstance.type === SpaceType.SourceRev) {
      return curr.newInstance.voltage * this.getMultiplier(hasBiggerDot, curr);
    }

    return 0;
  }

  private roundNumbers(arr: number[]): number[] {
    return arr.map(x => {
      const factor = Math.pow(10, 3);
      return Math.round(x * factor) / factor;
    });
  }

  private makeMatrix(paths: Array<Space[]>, elements: Space[]): Array<number> {
    const matrix = new Array<number[]>(elements.length);
    const matrixResult = new Array<number>(elements.length);
    let index = 0;
    for (const path of paths) {
      const line = new Array<number>(elements.length);
      for (let i = 0; i < line.length; ++i) {
        line[i] = 0;
      }
      let result = 0;
      let prevValue: Space;
      const hasBiggerDots = this.generateSequenceFromPath(path);
      for (let j = 0; j < path.length; j++) {
        const element = path[j];
        line[elements.indexOf(element)] = element.newInstance.resistance * this.getMultiplier(hasBiggerDots[j], element);
        result += this.addVoltage(element, hasBiggerDots[j]);
        prevValue = element;
      }
      matrix[index] = line;
      matrixResult[index] = result;
      index++;
    }


    // Sitoje vietoje jau turiu beveik sutvarkyta matrica
    const posibleDots = elements.map(x => x.dots).reduce((x, y) => x.concat(y)).filter((x, id, arr) => arr.indexOf(x) === id).sort();
    let dotsIndex = 0;
    while (index !== elements.length) {
      const point = posibleDots[dotsIndex];
      const line = new Array<number>(elements.length);
      for (let i = 0; i < line.length; ++i) {
          line[i] = 0;
      }
      for (const element of elements) {
        if (element.dots[0] === point) {
          line[elements.indexOf(element)] = -1;
        }
        if (element.dots[1] === point) {
          line[elements.indexOf(element)] = 1;
        }
      }
      dotsIndex++;
      matrixResult[index] = 0;
      matrix[index] = line;
      index++;
    }

    console.log('elementai');
    console.log(elements);
    console.log('galimi taskai');
    console.log(posibleDots);
    console.log('matrica');
    console.log(matrix);
    console.log('matricos rezultatas');
    console.log(matrixResult);

    return this.roundNumbers((new LinearHelper()).solve(matrix, matrixResult));
  }
}

class SpaceHelper {
  constructor(public chain: Space[], public waitingSpaces: Space[], public nextPoint: number) {}
}

export class SpaceView {

  name: string;
  voltage: number;

  constructor(type: SpaceType, public resistance: number, public stream: number, public index: number, public test: number) {
    this.name = this.getName(type);
    this.voltage = resistance * stream;
  }

  private getName(type: SpaceType): string {
    switch (type) {
      case(SpaceType.Resistor):
        return 'Varžas';
      case(SpaceType.Source):
        return 'Šaltinis';
      case(SpaceType.SourceRev):
        return 'Šaltinis';
      case(SpaceType.Wire):
        return 'Laidas';
    }
  }

}

