import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';
import { Todo } from './todo.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get()
  getAllTodos(): Todo[] {
    return this.appService.getAllTodos();
  }

  @Get(':id')
  getTodoById(@Param('id') id: string): Todo {
    return this.appService.getTodoById(id);
  }

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.appService.createTodo(createTodoDto);
  }

  @Put(':id')
  updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Todo {
    return this.appService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string): void {
    return this.appService.deleteTodo(id);
  }
}