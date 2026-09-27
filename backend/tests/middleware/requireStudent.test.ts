import { Request, Response } from "express";
import { expect, vi, describe, it } from "vitest";
import "../../src/types/RequestWithUserInfo.js";
import { requireStudent } from "../../src/middleware/requireStudent.js";

describe("requireStudent middleware", () => {
  const res = {} as Response;
  const next = vi.fn();

  it("should throw error if user role is not student", () => {
    const reqWithNonStudentRole = {
      user: { id: "1", role: "admin" },
    } as Request;
    expect(() => {
      requireStudent(reqWithNonStudentRole, res, next);
    }).toThrow(
      expect.objectContaining({
        message: "Student privileges required",
        statusCode: 403,
      }),
    );

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if user role is Student", () => {
    const reqStudent = { user: { id: "1", role: "student" } } as Request;
    requireStudent(reqStudent, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should throw error if user role is not present in request", () => {
    const requestWithoutRole = { user: { id: "1" } } as Request;
    expect(() => {
      requireStudent(requestWithoutRole, res, next);
    }).toThrow(
      expect.objectContaining({
        message: "Student privileges required",
        statusCode: 403,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw error if there is no user in the request", () => {
    const requestWithoutUser = {} as Request;
    expect(() => {
      requireStudent(requestWithoutUser, res, next);
    }).toThrow("Student privileges required");
    expect(next).not.toHaveBeenCalled();
  });
});
