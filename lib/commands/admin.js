const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

const grantIssuer = program.command('grant-issuer').action(async () => console.log("Grant Issuer not implemented yet"));
const revokeIssuer = program.command('revoke-issuer').action(async () => console.log("Revoke Issuer not implemented yet"));
const pause = program.command('pause').action(async () => console.log("Pause not implemented yet"));
const unpause = program.command('unpause').action(async () => console.log("Unpause not implemented yet"));

module.exports = {
  grantIssuer,
  revokeIssuer,
  pause,
  unpause
};
