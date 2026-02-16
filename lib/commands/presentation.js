const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

const create = program.command('create').action(async () => console.log("Create Presentation not implemented yet"));
const get = program.command('get').action(async () => console.log("Get Presentation not implemented yet"));
const verify = program.command('verify').action(async () => console.log("Verify Presentation not implemented yet"));

module.exports = {
  create,
  get,
  verify
};
