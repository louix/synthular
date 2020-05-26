import { Injectable, Inject } from '@angular/core';
import { AUDIO_CONTEXT } from '@ng-web-apis/audio';
import { interval } from 'rxjs/internal/observable/interval';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    baseOctave = 4;
    bpm = 120;

    constructor(@Inject(AUDIO_CONTEXT) private readonly audioContext: AudioContext) { }

    public async playSong() {
        const song = this.generateSong();
        const totalSongLength = song.reduce((total, note) => total + note.length, 0);
        const beat = interval(this.bpmToMs(this.bpm)).pipe(take(totalSongLength));

        let currentLength = -1;
        let currentNote = -1;

        beat.subscribe(_ => {
            if (currentLength <= 1) {
                currentNote += 1;
                currentLength = song[currentNote].length;
                this.beepNote(song[currentNote]);
            } else {
                currentLength -= 1;
            }
        });
    }

    private generateSong(): RawNote[] {
        const song: UserNote[] = [
            {
                note: Notes.e,
                octave: 4,
                length: 2,
            },
            {
                note: Notes.b,
                octave: 4,
                length: 1,
            },
            {
                note: Notes.c,
                octave: 4,
                length: 1,
            },
            {
                note: Notes.d,
                octave: 4,
                length: 2,
            },
            {
                note: Notes.c,
                octave: 4,
                length: 1,
            },
            {
                note: Notes.b,
                octave: 4,
                length: 1,
            },
            {
                note: Notes.a,
                octave: 4,
                length: 2,
            },
            {
                note: Notes.a,
                octave: 4,
                length: 1,
            },
            {
                note: Notes.c,
                octave: 4,
                length: 1,
            },
            {
                note: Notes.e,
                octave: 4,
                length: 2,
            }
        ];
        return song.map(note => {
            return {
                length: note.length,
                frequency: this.calculateFrequency(note)
            };
        });
    }

    private calculateFrequency(note: UserNote): number {
        const octaveDifference = note.octave - this.baseOctave;
        if (octaveDifference < 0) {
            return note.note / 2 * (octaveDifference * -1);
        } else if (octaveDifference > 0) {
            return note.note * 2 * octaveDifference;
        } else {
            return note.note;
        }
    }

    private async beepNote(note: RawNote) {
        await this.awaitSuspension();
        const wave = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const noteLength = this.bpmToSeconds(this.bpm) * note.length;

        gain.gain.value = 0.03;

        wave.type = 'square';
        wave.frequency.value = note.frequency;
        wave.onended = () => gain.disconnect();
        wave.connect(gain);

        gain.connect(this.audioContext.destination);
        wave.start();
        wave.stop(this.audioContext.currentTime + noteLength);
    }

    private bpmToMs(bpm: number): number {
        return 60000 / bpm / 2;
    }

    private bpmToSeconds(bpm: number): number {
        return this.bpmToMs(bpm) / 1000;
    }

    private async awaitSuspension() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

}


interface UserNote {
    note: Notes;
    octave: number;
    length: number;
}

interface RawNote {
    length: number;
    frequency: number;
}


enum Notes {
    'a' = 440.0,
    'a#' = 466.1638,
    'b' = 493.8833,
    'c' = 523.2511,
    'c#' = 554.3653,
    'd' = 587.3295 ,
    'd#' = 622.2540,
    'e' = 659.2551,
    'f' = 698.4565,
    'f#' = 739.9888,
    'g' = 783.9909,
    'g#' = 830.6094
}
