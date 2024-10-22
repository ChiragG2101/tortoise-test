export class WorkflowValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'WorkflowValidationException';
  }
}
