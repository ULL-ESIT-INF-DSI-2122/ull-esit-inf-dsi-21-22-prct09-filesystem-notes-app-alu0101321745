import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/note';

describe('Pruebas de la clase Note:', () => {
    const redNote = new Note('Red note', 'This is a red note.', 'red');
    const greenNote = new Note('Green note', 'This is a green note.', 'green');
    const blueNote = new Note('Blue note', 'This is a blue note.', 'blue');
    const yellowNote = new Note('Yellow note', 'This is a yellow note.', 'yellow');
    it('Las notas son instancias de su clase: ', () => {
        expect(redNote).to.be.instanceOf(Note);
        expect(greenNote).to.be.instanceOf(Note);
        expect(blueNote).to.be.instanceOf(Note);
        expect(yellowNote).to.be.instanceOf(Note);
    });
    it('Atributos:', () => {
        expect(redNote.title).to.be.eql('Red note');
        redNote.title = 'Green note';
        expect(redNote.title).to.be.eql('Green note');
        expect(redNote.body).to.be.eql('This is a red note.');
        redNote.body = 'This is a green note.';
        expect(redNote.body).to.be.eql('This is a green note.');
        expect(redNote.color).to.be.eql('red');
        redNote.color = 'green';
        expect(redNote.color).to.be.eql('green');
    });
});
