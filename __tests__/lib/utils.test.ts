import { cn } from "@/lib/utils";

describe("lib/utils", () => {
  describe("cn utility function", () => {
    it("should combine class names", () => {
      const result = cn("class1", "class2");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should handle undefined and null values", () => {
      const result = cn("class1", undefined, null, "class2");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).not.toContain("undefined");
      expect(result).not.toContain("null");
    });

    it("should handle boolean conditions", () => {
      const result = cn("class1", true && "class2", false && "class3");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).not.toContain("class3");
    });

    it("should handle arrays", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
    });

    it("should handle objects with conditional classes", () => {
      const result = cn({
        class1: true,
        class2: false,
        class3: true,
      });
      expect(result).toContain("class1");
      expect(result).toContain("class3");
      expect(result).not.toContain("class2");
    });

    it("should handle mixed arguments", () => {
      const result = cn(
        "base-class",
        ["array-class1", "array-class2"],
        {
          "conditional-true": true,
          "conditional-false": false,
        },
        undefined,
        "final-class",
      );

      expect(result).toContain("base-class");
      expect(result).toContain("array-class1");
      expect(result).toContain("array-class2");
      expect(result).toContain("conditional-true");
      expect(result).toContain("final-class");
      expect(result).not.toContain("conditional-false");
    });

    it("should handle empty strings", () => {
      const result = cn("", "class1", "", "class2");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should handle whitespace", () => {
      const result = cn("  class1  ", " class2 ");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should merge Tailwind classes correctly", () => {
      const result = cn("bg-red-500", "bg-blue-500");
      expect(result).toContain("bg-blue-500");
    });

    it("should handle complex Tailwind conflicts", () => {
      const result = cn("p-4", "px-6", "py-2");
      expect(result).toContain("px-6");
      expect(result).toContain("py-2");
    });

    it("should handle no arguments", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle single argument", () => {
      const result = cn("single-class");
      expect(result).toBe("single-class");
    });

    it("should handle duplicate classes", () => {
      const result = cn("class1", "class2", "class1");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should handle special characters in class names", () => {
      const result = cn(
        "class-with-dashes",
        "class_with_underscores",
        "class:with:colons",
      );
      expect(result).toContain("class-with-dashes");
      expect(result).toContain("class_with_underscores");
      expect(result).toContain("class:with:colons");
    });

    it("should handle numeric classes", () => {
      const result = cn("w-1", "h-2", "p-3");
      expect(result).toContain("w-1");
      expect(result).toContain("h-2");
      expect(result).toContain("p-3");
    });

    it("should handle responsive classes", () => {
      const result = cn("md:block", "lg:hidden", "xl:flex");
      expect(result).toContain("md:block");
      expect(result).toContain("lg:hidden");
      expect(result).toContain("xl:flex");
    });

    it("should handle hover and state classes", () => {
      const result = cn(
        "hover:bg-blue-500",
        "focus:outline-none",
        "active:scale-95",
      );
      expect(result).toContain("hover:bg-blue-500");
      expect(result).toContain("focus:outline-none");
      expect(result).toContain("active:scale-95");
    });

    it("should handle dark mode classes", () => {
      const result = cn(
        "bg-white",
        "dark:bg-gray-900",
        "text-black",
        "dark:text-white",
      );
      expect(result).toContain("bg-white");
      expect(result).toContain("dark:bg-gray-900");
      expect(result).toContain("text-black");
      expect(result).toContain("dark:text-white");
    });

    it("should handle very long class strings", () => {
      const longClass =
        "very-long-class-name-that-might-be-used-in-some-scenarios-with-lots-of-words";
      const result = cn(longClass, "short");
      expect(result).toContain(longClass);
      expect(result).toContain("short");
    });

    it("should handle nested arrays", () => {
      const result = cn(["class1", ["class2", "class3"]], "class4");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
      expect(result).toContain("class4");
    });

    it("should handle functions that return classes", () => {
      const getClass = () => "dynamic-class";
      const result = cn("static-class", getClass());
      expect(result).toContain("static-class");
      expect(result).toContain("dynamic-class");
    });

    it("should be type-safe with template literals", () => {
      const prefix = "btn";
      const suffix = "primary";
      const result = cn(`${prefix}-${suffix}`, "extra-class");
      expect(result).toContain("btn-primary");
      expect(result).toContain("extra-class");
    });
  });
});
