const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if no arguments', () => {
    const empl = new Employee({}); 
    empl.validate(err => {
      expect(err.errors.firstName && err.errors.lastName && err.errors.department).to.exist;
    });
  });

  it('should throw an error if missing argument', () => {
    const testCases = [
      {lastName: 'test_last', department: 'test_dep'}, 
      {firstName: 'test_first', department: 'test_dep'}, 
      {firstName: 'test_first', lastName: 'test_last'},
      {firstName: 'test_first'},
      {lastName: 'test_last'},
      {department: 'test_dep'}
    ];

    for(const testCase of testCases) {
      const empl = new Employee( testCase );
      empl.validate(err => {
        expect(err.errors.firstName || err.errors.lastName || err.errors.department).to.exist;
      });
    }
  });


  it('should throw an error if argument is not a string', () => {
    const testCases = [
      {firstName: {}, lastName: 'test_last', department: 'test_dep'},
      {firstName: 'test_first', lastName: {}, department: 'test_dep'},
      {firstName: 'test_first', lastName: 'test_last', department: {}},
      {firstName: [], lastName: 'test_last', department: 'test_dep'},
      {firstName: 'test_first', lastName: [], department: 'test_dep'},
      {firstName: 'test_first', lastName: 'test_last', department: []}
    ];

    for(const testCase of testCases) {
      const empl = new Employee( testCase );
      empl.validate(err => {
        expect(err.errors.firstName || err.errors.lastName || err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if arguments are okay', () => {
    const testCases = [
      {firstName: 'test_first', lastName: 'test_last', department: 'test_dep'},
      {firstName: 'John', lastName: 'Doe', department: 'Marketing'},
      {firstName: 'joHN', lastName: 'doE', department: 'Test Dep'}
  ];

  for(const testCase of testCases) {
    const empl = new Employee( testCase );
    empl.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });

});

after(() => {
  mongoose.models = {};
});