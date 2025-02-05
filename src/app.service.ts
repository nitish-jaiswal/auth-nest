import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';
import { Todo } from './todo.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  private todos: Todo[] = [
    {
      id: '1',
      title: 'Learn NestJS',
      description: 'Study the basics of NestJS framework',
      completed: false,
      createdAt: new Date('2023-01-01')
    },
    {
      id: '2',
      title: 'Build a Todo App',
      description: 'Create a full-stack Todo application',
      completed: false,
      createdAt: new Date('2023-02-01')
    },
    {
      id: '3',
      title: 'Refactor Code',
      description: 'Improve code quality and add more features',
      completed: true,
      createdAt: new Date('2023-03-01'),
      updatedAt: new Date('2023-03-15'),
    },
  ];

  getAllTodos(): Todo[] {
    return this.todos;
  }

  getTodoById(id: string): Todo {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  createTodo(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: Date.now().toString(),
      ...createTodoDto,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id: string, updateTodoDto: UpdateTodoDto): Todo {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.todos[todoIndex] = {
      ...this.todos[todoIndex],
      ...updateTodoDto,
      updatedAt: new Date(),
    };

    return this.todos[todoIndex];
  }

  deleteTodo(id: string): void {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(todoIndex, 1);
  }
}
