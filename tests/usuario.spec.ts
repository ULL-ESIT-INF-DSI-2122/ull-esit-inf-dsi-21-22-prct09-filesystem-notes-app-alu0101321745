import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/note';
import {Usuario} from '../src/usuario';

describe('Pruebas de la clase Usuario:', () => {
    const redNote = new Note('Red note', 'This is a red note.', 'red');
    const greenNote = new Note('Green note', 'This is a green note.', 'green');
    const blueNote = new Note('Blue note', 'This is a blue note.', 'blue');
    const yellowNote = new Note('Yellow note', 'This is a yellow note.', 'yellow');

    const usuario1 = new Usuario('Nico');
    const usuario2 = new Usuario('Dani');

    it('Los usuarios son instancias de su clase: ', () => {
        expect(usuario1).to.be.instanceOf(Usuario);
        expect(usuario2).to.be.instanceOf(Usuario);
    });
    it('Atributos:', () => {
        expect(usuario1.name).to.be.eql('Nico');
        expect(usuario2.name).to.be.eql('Dani');
    });
    it('Añadir notas', () => {
        usuario1.addNote(redNote.title, redNote.body, redNote.color);
        usuario2.addNote(redNote.title, redNote.body, redNote.color);
        usuario1.addNote(greenNote.title, greenNote.body, greenNote.color);
        usuario1.addNote(blueNote.title, blueNote.body, blueNote.color);
        usuario1.addNote(yellowNote.title, yellowNote.body, yellowNote.color);
        expect(usuario1.notes.length).to.be.eql(4);
    });
    it('Leer nota', () => {
        expect(usuario1.read(redNote.title)).to.be.eql(undefined);
        expect(usuario1.read(blueNote.title)).to.be.eql(undefined);
        expect(usuario1.read(greenNote.title)).to.be.eql(undefined);
        expect(usuario1.read(yellowNote.title)).to.be.eql(undefined);
    });
    it('Listar nota', () => {
        expect(usuario1.list()).to.be.eql(undefined);
        expect(usuario2.list()).to.be.eql(undefined);
    });
    it('Modificar nota', () => {
        expect(usuario1.modify('Red note', 'body', 'Hola')).to.be.eql(undefined);
    });

    it('Remover nota', () => {
        expect(usuario1.remove(redNote.title)).to.be.eql(undefined);
        expect(usuario1.remove(greenNote.title)).to.be.eql(undefined);
        expect(usuario1.remove(blueNote.title)).to.be.eql(undefined);
    });
});
