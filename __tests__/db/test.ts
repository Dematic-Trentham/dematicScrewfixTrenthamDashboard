describe("someFunction", () => {
	it("should return the expected result", () => {
		const result = someFunction();
		expect(result).toBe("expected result");
	});

	it("should fail this test to test the CI workflow", () => {
		const result = someFunction();
		expect(result).toBe("this will fail");
	});
});

function someFunction() {
	return "expected result";
}
