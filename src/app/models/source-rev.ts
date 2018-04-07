import { Space } from './space';
import { Direction } from './direction';
import { BuilderService } from '../service/builder.service';
import { SpaceType } from './sapce-type';
import { IElement } from './element';


export class SourceRev implements IElement {

    index: number;
    readonly type: SpaceType = SpaceType.SourceRev;

    constructor (canvas: any, space: Space, public resistance: number, public voltage: number) {
        const builder = new BuilderService();
        if (space.direction === Direction.Horizontal) {
            this.index = builder.buildSourceRev(canvas, space.x, space.y - 20, space.direction);
        } else {
            this.index = builder.buildSourceRev(canvas, space.x - 20, space.y, space.direction);
        }
    }
}
