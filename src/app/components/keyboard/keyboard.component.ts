import { Component, OnInit } from '@angular/core';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {

    finshedPlaying = true;

    constructor(private keyboardService: KeyboardService) { }

    ngOnInit(): void { }

    public async play() {
        await this.keyboardService.playSong();
    }
}
