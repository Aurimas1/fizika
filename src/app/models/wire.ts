import { Space } from './space';
import { Direction } from './direction';
import { BuilderService } from '../service/builder.service';
import { SpaceType } from './sapce-type';
import { IElement } from './element';

export class Wire implements IElement {

    readonly resistance: number = 0;
    readonly voltage: number = 0;
    readonly type: SpaceType = SpaceType.Wire;
    index = undefined;

    constructor(canvas: any, space: Space) {
        const builder = new BuilderService();
        if (space.direction === Direction.Horizontal) {
            builder.buildWire(canvas, space.x, space.y - 5, space.direction);
        } else {
            builder.buildWire(canvas, space.x - 5, space.y, space.direction);
        }
    }
}
