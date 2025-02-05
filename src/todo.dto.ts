export class CreateTodoDto {
    title: string;
    description?: string;
}

export class UpdateTodoDto {
    title?: string;
    description?: string;
    completed?: boolean;
}