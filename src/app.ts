import * as yargs from 'yargs';
import { Usuario } from './usuario';

/**
 * Comando yark para añadir una nota
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
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

yargs.argv;
