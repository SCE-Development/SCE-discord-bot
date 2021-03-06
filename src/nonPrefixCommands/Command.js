module.exports = class Command {
  constructor(args) {
    this.name = args.name;
    this.regex = args.regex;
    this.description = args.description;
    this.example = args.example;
    this.permissions = args.permissions;
    this.category = args.category;
    this.disabled = args.disabled || false;
    this.executeCommand = args.execute;
  }

  async execute(message) {
    this.executeCommand(message);
  }
};
