import "@testing-library/jest-dom";

// Extiende la interfaz de Jest para incluir los métodos personalizados
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveBeenCalledTimes(times: number): R;
      toHaveBeenCalled(): R;
      toHaveBeenLastCalledWith(...args: any[]): R;
    }
  }
}
