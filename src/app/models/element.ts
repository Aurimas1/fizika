import { SpaceType } from './sapce-type';

export interface IElement {
    type: SpaceType;
    resistance: number;
    voltage: number;
    index: number;
}
