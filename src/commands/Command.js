module.exports = class Command {
  constructor(args) {
    this.name = args.name;
    this.description = args.description;
    this.aliases = args.aliases;
    this.example = args.example;
    this.permissions = args.permissions;
    this.category = args.category;
    this.disabled = args.disabled || false;
    this.executeCommand = args.execute;
  }

  async execute(message, args) {
    // delete this
    this.executeCommand(message, args);
  }
};
