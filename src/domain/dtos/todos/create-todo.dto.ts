export class CreateTodoDto {
  public readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { text } = props;

    if (!text || text.length === 0)
      return ["Text property is required", undefined];

    return [undefined, new CreateTodoDto(text)];
  }
}
