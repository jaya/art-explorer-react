import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "changed", delay: 500 });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast-forward time by 250ms
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast-forward time by remaining 250ms
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("changed"); // Should now be changed
  });

  it("should reset the timer on subsequent value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    // Change the value
    rerender({ value: "changed1", delay: 500 });
    expect(result.current).toBe("initial");

    // Fast-forward by 250ms
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Change value again before timer completes
    rerender({ value: "changed2", delay: 500 });
    expect(result.current).toBe("initial");

    // Fast-forward by 250ms (total 500ms from first change, 250ms from second)
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast-forward by remaining 250ms
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("changed2"); // Should now be the latest value
  });

  it("should work with different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 100 },
      },
    );

    rerender({ value: "changed", delay: 100 });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("changed");
  });

  it("should work with different data types", () => {
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 100 },
      },
    );

    numberRerender({ value: 42, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(numberResult.current).toBe(42);

    const initialObj = { id: 1 };
    const changedObj = { id: 2 };
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 100 },
      },
    );

    expect(objectResult.current).toBe(initialObj);
    objectRerender({ value: changedObj, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(objectResult.current).toBe(changedObj);
  });

  it("should handle zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 0 },
      },
    );

    rerender({ value: "changed", delay: 0 });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe("changed");
  });

  it("should cleanup timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    rerender({ value: "changed", delay: 500 });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
