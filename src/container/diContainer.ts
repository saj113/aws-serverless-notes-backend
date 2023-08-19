import "reflect-metadata";
import { container } from 'tsyringe';
import {NoteRepository} from '../repositories/NoteRepository';
import {INoteService} from '../services/NoteService/interfaces/INoteService';
import {NoteService} from '../services/NoteService/NoteService';
import {INoteRepository} from '../repositories/interfaces/INoteRepository';
import {INoteController} from '../controllers/NoteController/interfaces/INoteController';
import {NoteController} from '../controllers/NoteController/NoteController';

container.registerSingleton<INoteRepository>('NoteRepository', NoteRepository);
container.register<INoteService>('NoteService', NoteService);
container.register<INoteController>('NoteController', NoteController);

export const diContainer = container;
