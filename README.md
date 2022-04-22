# Practica 9

## **Badges.**


[![SonarClound](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/actions/workflows/sonarcloud.yml)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/actions/workflows/node.js.yml)

[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/actions/workflows/coveralls.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745?branch=master)

La practica funciona en local pero por temas de ficheros al subirla se crashean los usuarios y los badges no sirven.

## **Algunas tareas previas.**
1. Repositorio: [click aquí](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101321745)
2. Paquete `yarg` : Paquete utilizado para gestionar comandos que configuraremos en nuestra aplicación de notas.
3. Paquete `chalk` : Paquete utilizado para el uso de colores en los textos de la consola.
4. Familiziarse con la API síncrona de Node.js, en concreto usamos los siguientes comandos:
    - `fs.readdirSync(path)` : Lee de forma síncrona un directorio y guarda sus archivos en una variable que podemos iterar.
    - `fs.readFileSync(path)` : Lee de forma síncrona el contenido de un archivo de texto.
    - `fs.writeFile(path)` : Escribe sobre un fichero de forma sincrona.
    - `fs.existsSync(path)` : Comprueba si existe un fichero en ese momento y devuelve un booleano.
    - `fs.renameSync(path/nombre, path/new_nombre)` : Renombra un fichero.
    - `fs.mkdirSync(path)` : Crea un directorio y/o fichero de texto.
    - `fs.rm(path)` : Borra un fichero del path

## **Práctica 9 - Aplicación de procesamiento de notas de texto**


Crearemos una aplicación que asocie notas de distintos colores a usuarios en especifico. Para esto haremos usos de los paquetes yarg y chalk mencionados anteriormente para crear un modelo persistente mediante el uso de los JSON.

Para trabajar con los JSON principalmente tenemos dos funciones importantes:

- `const contenidoNota = fs.readFileSync(src/usuarios/${this.name}/${title}.json);` : Almacena en una variable el buffer de un fichero en específico.
- `const noteJSON = JSON.parse(contenidoNota.toString());` : Transforma en JSON el contenido del buffer.

Lo primero que necesitamos definir es una clase Notas con los argumentos correspondientes, a continuación podemos ver el código:

```ts
/**
 * Clase que representa una nota.
 * @param title :
 * @param body :
 * @param color :
 */
export class Note {
    constructor(public title: string, public body: string, public color: string) {}
}
```

Una vez que tenemos esta clase, pasamos a nuestra clase usuario donde gestionaremos cada nota de los usuarios dependiendo de los comandos que definamos, el código se puede ver a continuación:

```ts
import {Note} from './note';
import * as fs from 'fs';
import chalk from 'chalk';
import { stdout } from 'process';
/**
 * Clase para representar usuarios con sus notas correspondientes.
 * @param notas : Notas del usuario.
 * @param name : Nombre del usuario.
 * @method addNote() : Método para añadir notas al usuario, creando archivos JSON para cada tipo de note.
 * @method list() : Lista todas las notas del usuario.
 * @method read() : Lee una nota del usuario.
 * @method remove() : Elimina una nota del usuario.
* Usages:
 * ```ts
 * const user = new Usuario(nombre);
 * user.addNote(title, body, color);
 * user.list();
 * user.read(title_note);
 * user.remove(title_note);
 * ```
 */
export class Usuario {
  public notes: Note[] = [];
  // Constructor donde se crea y sincroniza o solo sincroniza el directorio del usuario.
  constructor(public name: string) {
    if (fs.existsSync(`src/usuarios/${this.name}`)) {
      const files = fs.readdirSync(`src/usuarios/${this.name}/`);
      files.forEach((file) => {
        const contenidoNota = fs.readFileSync(`src/usuarios/${this.name}/${file}`);
        const noteJSON = JSON.parse(contenidoNota.toString());
        const note = new Note(noteJSON.title, noteJSON.body, noteJSON.color);
        this.notes.push(note);
      });
    } else {
      fs.mkdirSync(`src/usuarios/${this.name}`);
    }
  }
  // Añadir notas al usuario.
  public addNote(title: string, body: string, color: string) {
    if (fs.existsSync(`src/usuarios/${this.name}/${title}.json`) == false) {
      this.notes.push(new Note(title, body, color));
      fs.writeFile(`src/usuarios/${this.name}/${title}.json`, `{\n\t"title": "${title}",\n\t"body": "${body}",\n\t"color": "${color}"\n}`, () => {
        console.log(chalk.green('New note added!'));
      });
    } else {
      console.log(chalk.red("Note title taken!"));
    }
  }
  // Listar las notas del usuario.
  public list(): void {
    console.log('Your notes:');
    if (this.notes.length === 0) {
      console.log(chalk.red('You don`t have any note.'));
      return undefined;
    }
    let count = 1;
    this.notes.forEach( (note) => {
      process.stdout.write(`${count}.- `);
      count = count + 1;
      switch (note.color) {
        case "red":
          console.log(chalk.red(`${note.title}`));
          break;
        case "green":
          console.log(chalk.green(`${note.title}`));
          break;
        case "blue":
          console.log(chalk.blue(`${note.title}`));
          break;
        case "yellow":
          console.log(chalk.yellow(`${note.title}`));
          break;
      }
    });
  }
  // Leer una nota del usuario.
  public read(title: string): void {
    if (fs.existsSync(`src/usuarios/${this.name}/${title}.json`)) {
      const contenidoNota = fs.readFileSync(`src/usuarios/${this.name}/${title}.json`);
      const noteJSON = JSON.parse(contenidoNota.toString());
      switch (noteJSON.color) {
        case "red":
          console.log(chalk.red(`${noteJSON.title}`));
          console.log(chalk.red(`${noteJSON.body}`));
          break;
        case "green":
          console.log(chalk.green(`${noteJSON.title}`));
          console.log(chalk.green(`${noteJSON.body}`));
          break;
        case "blue":
          console.log(chalk.blue(`${noteJSON.title}`));
          console.log(chalk.blue(`${noteJSON.body}`));
          break;
        case "yellow":
          console.log(chalk.yellow(`${noteJSON.title}`));
          console.log(chalk.yellow(`${noteJSON.body}`));
          break;
      }
    } else {
      console.log(chalk.red(`You don't have any note with title: ${title}.`));
    }
  }
  // Eliminar una nota de la lista.
  public remove(title: string): void {
    if (fs.existsSync(`src/usuarios/${this.name}/${title}.json`)) {
      fs.rm(`src/usuarios/${this.name}/${title}.json`, () => {
        console.log(chalk.green('Note removed!'));
      });
    } else {
      console.log(chalk.red(`You don't have any note with title: ${title}.`));
    }
  }
  // Modificar una nota.
  public modify(contenidoNota: Buffer, param: string, newVal: string) {
      const noteJSON = JSON.parse(contenidoNota.toString());
      const title = noteJSON.title;
      const body = noteJSON.body;
      const color = noteJSON.color;
      if (param === "title") {
        fs.renameSync(`src/usuarios/${this.name}/${title}.json`, `src/usuarios/${this.name}/${newVal}.json`);
        fs.writeFile(`src/usuarios/${this.name}/${newVal}.json`, `{\n\t"title": "${newVal}",\n\t"body": "${body}",\n\t"color": "${color}"\n}`, () => {
          console.log(chalk.green('Note modified!'));
        });
      }
      if (param === "body") {
        fs.writeFile(`src/usuarios/${this.name}/${title}.json`, `{\n\t"title": "${title}",\n\t"body": "${newVal}",\n\t"color": "${color}"\n}`, () => {
          console.log(chalk.green('Note modified'));
        });
      }
      if (param === "color") {
        fs.writeFile(`src/usuarios/${this.name}/${title}.json`, `{\n\t"title": "${title}",\n\t"body": "${body}",\n\t"color": "${newVal}"\n}`, () => {
          console.log(chalk.green('Note modified'));
        });
      }
  }
}
```

Lo más importante de entender en esta clase es que trabajamos continuamente con los archivos JSON dentro del fichero del usuario en particular ya que queremos que la aplicacion sea persistente.

Además, mediante el uso del paquete chalk definimos los éxitos con colores verdes y los fallos con colores rojos además de imprimir las notas con sus colores correspondientes.

A continuación, definiremos los comandos haciendo uso del paquete yarg:

```ts
import * as yargs from 'yargs';
import { Usuario } from './usuario';
import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Comando yark para añadir una nota.
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color == 'string') {
      const usuario = new Usuario(argv.user);
      usuario.addNote(argv.title, argv.body, argv.color);
    }
  },
});
/**
 * Comando yark para listar todas las notas de un usuario.
 */
yargs.command({
  command: 'list',
  describe: 'list the notes of an user',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const usuario = new Usuario(argv.user);
      usuario.list();
    }
  },
});
/**
 * Comando yark para leer una nota.
 */
yargs.command({
  command: 'read',
  describe: 'read the note of an user',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const usuario = new Usuario(argv.user);
      usuario.read(argv.title);
    }
  },
});
/**
 * Comando yark para eliminar una nota.
 */
 yargs.command({
  command: 'remove',
  describe: 'remove the note of an user',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const usuario = new Usuario(argv.user);
      usuario.remove(argv.title);
    }
  },
});
/**
 * Comando yark para modificar una nota.
 */
 yargs.command({
  command: 'modify',
  describe: 'read the note of an user',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titule',
      demandOption: true,
      type: 'string',
    },
    param: {
      describe: 'Param to modify',
      demandOption: true,
      type: 'string',
    },
    newVal: {
      describe: 'New value',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.param === 'string' && typeof argv.newVal === 'string') {
      if (fs.existsSync(`src/usuarios/${argv.user}/${argv.title}.json`)) {
        const usuario = new Usuario(argv.user);
        const contenidoNota = fs.readFileSync(`src/usuarios/${argv.user}/${argv.title}.json`);
        usuario.modify(contenidoNota, argv.param, argv.newVal);
      } else {
        console.log(chalk.red(`You don't have any note with title: ${argv.title}.`));
      }
    }
  },
});

yargs.argv;
```
En concreto tenemos 5 comandos:

1. `add()` : Añadimos una nota a un usuario con todos sus parámetros.
    - Si no hay una nota con el titulo, se añade y se imprime un mensaje de exito en verde.
    - Si ya hay una nota con el titulo, se imprime un mensaje de error en rojo.
2. `remove()` : Eliminamos una nota del usuario en particular por el titulo.
    - Si existe la nota se elimina y se imprime un mensaje de éxito en verde.
    - Si no existe una nota con dicho titulo se imprime un mensaje de error por pantalla.
3. `list()` : Se imprime una lista con todas las notas almacenadas del usuario. 
    - Si el usuario tiene notas se imprimen su titulo y contenido con los colores de la nota correspondiente.
    - Si el usuario no tiene notas se imprime un mensaje de error en rojo.
4. `read()` : Se lee una nota por el título del usuario.
    - En caso de que exista dicha nota se lee con su titulo y contenido asociados al color de la nota.
    - En caso de que no exista la nota se imprime un mensaje de error rojo.
5. `modify()` : Se modifica una nota indicando el parametro a modificar y el nuevo valor.
    - En caso de que exista la nota se modifica y se imprime un mensaje de exito verde.
    - En caso de que no exista la nota se imprime un mensaje de error en rojo.

---

Una vez terminado todo esto, procedemos a crear las siguientes pruebas:

Pruebas de la clase note:
```ts
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
```

Prueba de la clase usuario:
```ts
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
        expect(usuario1.modify('Red note', 'title', 'Hola')).to.be.eql(undefined);
        expect(usuario1.modify('Red note', 'body', 'Hola')).to.be.eql(undefined);
        expect(usuario1.modify('Red note', 'color', 'Hola')).to.be.eql(undefined);
    });

    it('Remover nota', () => {
        expect(usuario1.remove(redNote.title)).to.be.eql(undefined);
        expect(usuario1.remove(greenNote.title)).to.be.eql(undefined);
        expect(usuario1.remove(blueNote.title)).to.be.eql(undefined);
        expect(usuario1.remove(yellowNote.title)).to.be.eql(undefined);
    });
});
```
