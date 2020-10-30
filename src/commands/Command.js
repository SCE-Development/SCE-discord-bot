module.exports = class Command {
  constructor(args) {
    this.name = args.name;
    this.aliases = args.aliases;
    this.description = args.description;
    this.example = args.example;
    this.permissions = args.permissions;
    this.category = args.category;
    this.executeCommand = args.execute;
  }

  async execute(message, args) {
    this.executeCommand(message, args);
  }
};
