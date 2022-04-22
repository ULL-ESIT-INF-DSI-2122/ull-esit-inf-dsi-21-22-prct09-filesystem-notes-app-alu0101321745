import {Nota} from './nota';
import * as fs from 'fs';
import chalk from 'chalk';
/**
 * Clase para representar usuarios con sus notas correspondientes.
 * @param notas : Notas del usuario.
 * @param name : Nombre del usuario.
 * @method addNote() : Método para añadir notas al usuario, creando archivos JSON para cada tipo de nota.
* Usages:
 * ```ts
 * const user = new Usuario(nombre)
 * user.addNote(title, body, color)
 * ```
 */
export class Usuario {
  public notas: Nota[] = [];
  constructor(public name: string) {
    const directorioExiste: boolean = fs.existsSync(`src/usuarios/${this.name}`);

    if (directorioExiste) {
      const ficheros = fs.readdirSync(`src/usuarios/${this.name}/`);

      ficheros.forEach((fichero) => {
        const contenidoNota = fs.readFileSync(`src/usuarios/${this.name}/${fichero}`);
        const notaJson = JSON.parse(contenidoNota.toString());

        const nota = new Nota(notaJson.title, notaJson.body, notaJson.color);
        this.notas.push(nota);
      });
    } else {
      fs.mkdirSync(`src/usuarios/${this.name}`);
    }
  }
  public addNote(title: string, body: string, color: string) {
    const ficheroExiste: boolean = fs.existsSync(`src/usuarios/${this.name}/${title}.json`);

    if (ficheroExiste == false) {
      this.notas.push(new Nota(title, body, color));
      fs.writeFile(`src/usuarios/${this.name}/${title}.json`, `{\n\t"title": "${title}",\n\t"body": "${body}",\n\t"color": "${color}"\n}`, () => {
        console.log(chalk.green('New note added!'));
      });
    } else {
      console.log(chalk.red("Note title taken!"));
    }
  }
}
