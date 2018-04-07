import { Direction } from './direction';
import { IElement } from './element';

export class Space {

    public newInstance: IElement;

    constructor(
        public instance: any,
        public x: number,
        public y: number,
        public direction: Direction,
        public dots: number[]
    ) {}
}
