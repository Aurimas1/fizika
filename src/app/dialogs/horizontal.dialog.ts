import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Space, SpaceType, Direction } from '../models';
import { AppServiceService } from '../app-service.service';
import { BuilderService } from '../service/builder.service';
declare const SVG: any;

@Component({
    templateUrl: './horizontal.dialog.html',
})
export class HorizontalDialogComponent implements OnInit {

    get space() { return this.data.space; }
    get direction() { return this.data.direction; }

    constructor(
        public dialogRef: MatDialogRef<HorizontalDialogComponent>,
        private service: AppServiceService,
        private builder: BuilderService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.createSVG('resistor-canvas', SpaceType.Resistor);
        this.createSVG('source-canvas', SpaceType.Source);
        this.createSVG('source-rev-canvas', SpaceType.SourceRev);
        this.createSVG('wire-canvas', SpaceType.Wire);
    }

    private createSVG(id: string, type: SpaceType) {
        const x = this.direction === Direction.Horizontal ? 100 : type === SpaceType.Wire ? 10 : 40;
        const y = this.direction === Direction.Vertical ? 100 : type === SpaceType.Wire ? 10 : 40;
        this.builder.build(type, SVG(id).size(x, y), 0, 0, this.direction);
    }

    onSave(type: SpaceType, resistance?: number, voltage?: number) {
        this.service.changeSpace(this.space, type, resistance, voltage);
        this.dialogRef.close();
    }

    onSaveResistor = (resistance: string) => this.onSave(SpaceType.Resistor, +resistance);

    onSaveWire = () => this.onSave(SpaceType.Wire);

    onSaveSource = (resistance: string, voltage: string) => this.onSave(SpaceType.Source, +resistance, +voltage);

    onSaveSourceRev = (resistance: string, voltage: string) => this.onSave(SpaceType.SourceRev, +resistance, +voltage);
}
