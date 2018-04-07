import { Space } from './space';
import { Direction } from './direction';
import { BuilderService } from '../service/builder.service';
import { SpaceType } from './sapce-type';
import { IElement } from './element';

export class Resistor implements IElement {

    index: number;
    readonly voltage = 0;
    readonly type: SpaceType = SpaceType.Resistor;

    constructor (canvas: any, space: Space, public resistance: number) {
        const builder = new BuilderService();
        if (space.direction === Direction.Horizontal) {
            this.index = builder.buildResistor(canvas, space.x, space.y - 20, space.direction);
        } else {
            this.index = builder.buildResistor(canvas, space.x - 20, space.y, space.direction);
        }
    }
}
