const expect = require('expect.js');

const {
  loadView
} = require('../utils');

describe('Test loadView', () => {
  console.log(loadView('index'))
  it('返回值为字符串', () => {
    expect(loadView('index')).to.be.a('string');
  });
});