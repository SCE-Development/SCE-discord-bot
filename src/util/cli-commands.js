module.exports = {
  gitCommands: [
    { name: '`git add .`',
      value: 'Stage all changes in working directory for next commit'
    },
    { name: '`git status`',
      value: 'List which files are staged, unstaged, and untracked'
    },
    { name: '`git commit -m "<message>"`',
      // eslint-disable-next-line
      value: 'Takes a snapshot of all staged changes, and add a commit message inline'
    },
    { name: '`git pull <remote>`',
      // eslint-disable-next-line
      value: 'Fetch state of the remote branch and merge it with local branch in one step'
    },
    { name: '`git push <remote> <branch>`',
      // eslint-disable-next-line
      value: 'Push local branch with commited changes to branch name on remote repository'
    }
  ],
  npmCommands: [
    { name: '💻 Core-v4 Specific',
      value:
        '- `npm install`: Install frontend dependencies\n' +
        '- `npm run server-install`: Install backend dependencies\n' +
        '- `npm run start`: Start the frontend\n' +
        '- `npm run server`: Start the backend\n' +
        '- `npm run lint`: Run ESLint to clean up your code structure\n' +
        '- `npm run create-user`: Create a user completely from the CLI\n' +
        '- `npm run generate-token`: Generate an auth token for Google APIs\n' +
        // eslint-disable-next-line
        '- `npm run api-test`: Run API tests to ensure backend logic behaves as expected\n' +
        // eslint-disable-next-line
        '- `npm run frontend-test`: Run frontend tests to ensure frontend user-flow behaves as expected\n'
    },
    { name: '🖨 SCE-RPC Specific',
      value:
        '- `npm install`: Install dependencies\n' +
        '- `npm run start`: Start the RPC API server\n' +
        '- `npm run lint`: Run ESLint to clean up your code structure\n' +
        // eslint-disable-next-line
        '- `npm run test`: Run API tests to ensure your code behaves as expected\n'
    },
    { name: '🤖 SCE-discord-bot Specific',
      value:
        '- `npm run start`: Start the server to listen for message events\n' +
        '- `npm run lint`: Run ESLint to clean up your code structure'
    }
  ]
};
