const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee CRUD', () => {

  before(async () => {
    try {
      await mongoose.connect(
        'mongodb://localhost:27017/companyDBtest', 
        { useNewUrlParser: true, useUnifiedTopology: true }
        );
    } catch(err) {
      console.error(err);
    }   
  });

  describe('Reading data', () => {

    before(async () => {
      const testEmployeeOne = new Employee({ firstName: 'first_name_#1', lastName: 'last_name_#1', department: 'dep_#1' });
      await testEmployeeOne.save();
  
      const testEmployeeTwo = new Employee({ firstName: 'first_name_#2', lastName: 'last_name_#2', department: 'dep_#2' });
      await testEmployeeTwo.save();
    });
  
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    
    it('should return a proper document by various params with "findOne" method', async () => {
      const employeeFirst = await Employee.findOne({ firstName: 'first_name_#1' });
      const employeeLast = await Employee.findOne({ lastName: 'last_name_#2' });
      const employeeDep = await Employee.findOne({ department: 'dep_#1' });

      const expectedResultByFirst = 'first_name_#1';
      const expectedResultByLast = 'last_name_#2';
      const expectedResultByDep = 'dep_#1';

      expect(employeeFirst.firstName).to.be.equal('first_name_#1');
      expect(employeeLast.lastName).to.be.equal('last_name_#2');
      expect(employeeDep.department).to.be.equal('dep_#1');
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });
  
  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'first_name_#1', lastName: 'last_name_#1', department: 'dep_#1' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
  
    after(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmployeeOne = new Employee({ firstName: 'first_name_#1', lastName: 'last_name_#1', department: 'dep_#1' });
      await testEmployeeOne.save();
  
      const testEmployeeTwo = new Employee({ firstName: 'first_name_#2', lastName: 'last_name_#2', department: 'dep_#2' });
      await testEmployeeTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'first_name_#1' }, { $set: { firstName: 'updated_first_name', lastName: 'updated_last_name', department: 'dep_#1' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'updated_first_name' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const empl = await Employee.findOne({ firstName: 'first_name_#1' });
      empl.firstName = 'updated_first_name';
      await empl.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: 'updated_first_name' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'updated_first_name', lastName: 'updated_last_name', department: 'dep_#1' }});
      const employees = await Employee.find();
      expect(employees[0].firstName).to.be.equal('updated_first_name');
      expect(employees[1].firstName).to.be.equal('updated_first_name');
    });
  
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmployeeOne = new Employee({ firstName: 'first_name_#1', lastName: 'last_name_#1', department: 'dep_#1' });
      await testEmployeeOne.save();
  
      const testEmployeeTwo = new Employee({ firstName: 'first_name_#2', lastName: 'last_name_#2', department: 'dep_#2' });
      await testEmployeeTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'first_name_#1' });
      const removeEmployee = await Employee.findOne({ firstName: 'first_name_#1' });
      expect(removeEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const empl = await Employee.findOne({ firstName: 'first_name_#1' });
      await empl.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'first_name_#1' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const empl = await Employee.find();
      expect(empl.length).to.be.equal(0);
    });
  });
});