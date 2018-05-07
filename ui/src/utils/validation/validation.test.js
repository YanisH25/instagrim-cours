import Validator from "./validation";

describe("The validator",() => {
	let validator;
	let functionTriggered;
	beforeEach(() => {
		validator = new Validator();
		functionTriggered = "it doesn't work as expected";
	});

	it("should allow us to add validating functions", () => {
		Validator.addType("test", () => {
			functionTriggered = "it works as expected";
		});
		validator.validate(null, {
			types: "test"
		});
		expect(functionTriggered).toEqual("it works as expected");
	});

	it("should allow us to delete validating functions", () => {
		function test() {
			functionTriggered = "it works as expected";
		}
		function test2() {
			functionTriggered = "it works as expected 2";
		}
		Validator.addType("testdelete", test);
		Validator.addType("testdelete", test2);

		Validator.deleteType("test", test);
		validator.validate(null, {
			types:"testdelete"
		});
		expect(functionTriggered).toEqual("it works as expected 2");
		Validator.deleteType("testdelete");
		functionTriggered = "it doesn't work as expected";
		validator.validate(null, {
			types:"testdelete"
		});
		expect(functionTriggered).toEqual("it doesn't work as expected");
	});

	it("should allow us to add parameter functions", () => {
		Validator.addParameter("test", () => {
			functionTriggered = "it works as expected";
		});
		validator.validate(null, {
			test: 12
		});
		expect(functionTriggered).toEqual("it works as expected");
	});

	it("should allow us to delete parameter functions", () => {
		function test() {
			functionTriggered = "it works as expected";
		}
		function test2() {
			functionTriggered = "it works as expected 2";
		}
		Validator.addParameter("test", test);
		Validator.addParameter("test", test2);

		Validator.deleteParameter("test", test);
		validator.validate(null, {
			test: 12
		});
		expect(functionTriggered).toEqual("it works as expected 2");
		Validator.deleteParameter("test");
		functionTriggered = "it doesn't work as expected";
		validator.validate(null, {
			test: 12
		});
		expect(functionTriggered).toEqual("it doesn't work as expected");
	});

	it("should allow us to validate element", () => {
		Validator.addType("isNumber", element => typeof element === "number");
		Validator.addParameter("minimum", (element, valueOfParameter) => element >= valueOfParameter);
		expect(validator.validate(false, {
			minimum: 6,
			types: "isNumber"
		})).toBeFalsy();
		expect(validator.validate(1234, {
			minimum: 6,
			types: "isNumber"
		})).toBeTruthy();
	});

	it("should have type email working", () => {
		expect(validator.validate("qioudjhqoidjqoijdoqidjd", {
			types: "email"
		})).toBeFalsy();
		expect(validator.validate("test1234@gmail.com", {
			types: "email"
		})).toBeTruthy();
	});

	it("should have type french phone number working", () => {
		expect(validator.validate("06548832135185478613521", {
			types: "phone-fr"
		})).toBeFalsy();
		expect(validator.validate("+66659784526", {
			types: "phone-fr"
		})).toBeFalsy();
		expect(validator.validate("0358975648",{
			types: "phone-fr"
		})).toBeTruthy();
		expect(validator.validate("+33358975648",{
			types: "phone-fr"
		})).toBeTruthy();
	});

	it("should have min parameter working on number, string and array", () => {
		expect(validator.validate(40, {
			min: 24
		})).toBeTruthy();
		expect(validator.validate(40, {
			min: 41
		})).toBeFalsy();
		expect(validator.validate(40, {
			min: 40
		})).toBeTruthy();

		expect(validator.validate("123456789", {
			min: 8
		})).toBeTruthy();
		expect(validator.validate("123456789", {
			min: 10
		})).toBeFalsy();
		expect(validator.validate("123456789", {
			min: 9
		})).toBeTruthy();

		expect(validator.validate([1,2,3,4,5,6], {
			min: 9
		})).toBeFalsy();
		expect(validator.validate([1,2,3,4,5,6], {
			min: 5
		})).toBeTruthy();
		expect(validator.validate([1,2,3,4,5,6], {
			min: 6
		})).toBeTruthy();
	});

	it("should have max parameter working on number, string and array", () => {
		expect(validator.validate(40, {
			max: 24
		})).toBeFalsy();
		expect(validator.validate(40, {
			max: 41
		})).toBeTruthy();
		expect(validator.validate(40, {
			max: 40
		})).toBeTruthy();

		expect(validator.validate("123456789", {
			max: 8
		})).toBeFalsy();
		expect(validator.validate("123456789", {
			max: 10
		})).toBeTruthy();
		expect(validator.validate("123456789", {
			max: 9
		})).toBeTruthy();

		expect(validator.validate([1,2,3,4,5,6], {
			max: 9
		})).toBeTruthy();
		expect(validator.validate([1,2,3,4,5,6], {
			max: 5
		})).toBeFalsy();
		expect(validator.validate([1,2,3,4,5,6], {
			max: 6
		})).toBeTruthy();
	});

	it("should have equal and deepEqual parameters that work on all objects", () => {
		expect(validator.validate("65888", {
			equal: 65888
		})).toBeTruthy();
		expect(validator.validate("65888", {
			deepEqual: 65888
		})).toBeFalsy();
		const testArray = [1,2,3,4,5,6];
		expect(validator.validate(testArray, {
			equal: [1,2,3,4,5,6]
		})).toBeFalsy();
		expect(validator.validate(testArray, {
			deepEqual: [1,2,3,4,5,6]
		})).toBeTruthy();
		const testObject = {
			somedummyteststring: "somedummystuff",
			sommedummytestnumber: 65465854,
			sommedummytestarray: [1,2,3,4,5,6],
			somedummytestobject: {
				somedummydummytestcontent: "5462154465465464"
			}
		};
		expect(validator.validate(testObject, {
			equal: {
				somedummyteststring: "somedummystuff",
				sommedummytestnumber: 65465854,
				sommedummytestarray: [1,2,3,4,5,6],
				somedummytestobject: {
					somedummydummytestcontent: "5462154465465464"
				}
			}
		})).toBeFalsy();
		expect(validator.validate(testObject, {
			deepEqual: {
				somedummyteststring: "somedummystuff",
				sommedummytestnumber: 65465854,
				sommedummytestarray: [1,2,3,4,5,6],
				somedummytestobject: {
					somedummydummytestcontent: "5462154465465464"
				}
			}
		})).toBeTruthy();
	});
});