import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { Login } from "../pages/Login.jsx";

const loginMock = vi.fn();

vi.mock("../hooks/useAuth.js", () => ({
  useAuth: () => ({ login: loginMock })
}));

describe("Login page", () => {
  it("calls login on submit", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalled();
  });
});
