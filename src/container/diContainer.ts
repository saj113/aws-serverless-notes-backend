import "reflect-metadata";
import { container } from 'tsyringe';
import {NoteRepository} from '../repositories/NoteRepository';
import {INoteService} from '../services/NoteService/interfaces/INoteService';
import {NoteService} from '../services/NoteService/NoteService';
import {INoteRepository} from '../repositories/interfaces/INoteRepository';

container.registerSingleton<INoteRepository>('NoteRepository', NoteRepository);
container.register<INoteService>('NoteService', NoteService);

export const diContainer = container;
