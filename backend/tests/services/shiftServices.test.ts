import { describe, it, expect, vi } from "vitest";
import * as ShiftModel from "../../src/models/shiftModel.js";
import * as UserModel from "../../src/models/userModel.js";
import {
  createAssignmentForShift,
  createShiftRequest,
  getRequestsForShift,
  modifyShift,
  modifyShiftAssignedAdmin,
} from "../../src/services/shiftsServices.js";
import { Shift } from "../../src/types/Shift.js";
vi.mock("../../src/models/shiftModel.js");
vi.mock("../../src/models/userModel.js");

describe("modifyShift", () => {
  const fakeShift: Shift = {
    id: 1,
    scheduled_start_time: "08:00",
    scheduled_end_time: "16:00",
    date: "2023-01-01",
    shift_type: "morning",
  };
  it("should return error 404 when the shift does not exits", async () => {
    // Arrange : the fake model says 'no shift found'
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(null);

    // Act & Assert : the service should throw a 404 error
    await expect(
      modifyShift("999", { scheduled_start_time: "08:00" }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("should return errror 400 when empty object is provided", async () => {
    // Arrange : the fake model says 'shift found'

    // Act & Assert : the service should throw a 400 error
    await expect(modifyShift("1", {})).rejects.toMatchObject({
      statusCode: 400,
    });
  });
  it("should return 400 when an unknown field is provided and the error message names the field.", async () => {
    await expect(
      modifyShift("1", { unknown_field: "value" } as any),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining("unknown_field"),
    });
  });
  it("should return 400 if start time later than end time is provided", async () => {
    // Arrange : the fake model says 'shift found'
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(fakeShift);

    // Act & Assert : the service should throw a 400 error
    await expect(
      modifyShift("1", {
        scheduled_start_time: "17:00",
        scheduled_end_time: "16:00",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "scheduled_start_time must be earlier than scheduled_end_time",
    });
    expect(ShiftModel.modifyShift).not.toHaveBeenCalled();
  });

  it("should pass the validated fields to the model", async () => {
    // Arrange : the fake model says 'shift found'
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(fakeShift);
    // Act : the fake model says 'shift modified'
    await modifyShift("1", {
      scheduled_start_time: "09:00",
      scheduled_end_time: "17:00",
    });
    // Assert : the model was called with the validated fields
    expect(ShiftModel.modifyShift).toHaveBeenCalledWith("1", {
      scheduled_start_time: "09:00",
      scheduled_end_time: "17:00",
    });
  });

  it("should throw 400 erorr naming the invalid fields when they are mixed with the valid ones ", async () => {
    await expect(
      modifyShift("1", {
        scheduled_start_time: "09:00",
        scheduled_end_time: "17:00",
        date: "2023-01-01",
      } as any),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining("date"),
    });

    expect(ShiftModel.getShiftById).not.toHaveBeenCalled();
    expect(ShiftModel.modifyShift).not.toHaveBeenCalled();
  });

  it("should accept a shift where only the minutes differ", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(fakeShift);

    await modifyShift("1", {
      scheduled_start_time: "09:30",
      scheduled_end_time: "09:45",
    });
    expect(ShiftModel.modifyShift).toHaveBeenCalledWith("1", {
      scheduled_start_time: "09:30",
      scheduled_end_time: "09:45",
    });
  });
  it("should throw 400 error when scheduled_start_time is equal to scheduled_end_time", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(fakeShift);

    await expect(
      modifyShift("1", {
        scheduled_start_time: "09:00",
        scheduled_end_time: "09:00",
      } as any),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "scheduled_start_time must be earlier than scheduled_end_time",
    });
    expect(ShiftModel.modifyShift).not.toHaveBeenCalled();
  });
});

describe("getRequestsForShift", () => {
  const mockShiftId = "123";
  const mockShift: Shift = {
    id: Number(mockShiftId),
    scheduled_start_time: "08:00",
    scheduled_end_time: "16:00",
    date: "2023-01-01",
    shift_type: "morning",
  };
  const mockRequests = [
    {
      user_id: 1,
      shift_id: Number(mockShiftId),
      request_created_at: "2023-01-01T08:00:00Z",
      username: "user1",
      first_name: "John",
      last_name: "Doe",
    },
  ];

  it("should throw 400 error when shiftId is not provided", async () => {
    await expect(getRequestsForShift("")).rejects.toMatchObject({
      statusCode: 400,
      message: "Shift ID is required",
    });
  });

  it("should throw 404 error when shiftId does not exist", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(null);
    await expect(getRequestsForShift("dada")).rejects.toMatchObject({
      statusCode: 404,
      message: "Shift with ID dada not found",
    });
  });
  it("should return the requests for the shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(ShiftModel.getRequestsForShift).mockResolvedValue(mockRequests);

    const result = await getRequestsForShift(mockShiftId);

    expect(result).toEqual({
      shift_id: mockShiftId,
      students: mockRequests.map(
        ({ shift_id: _shiftId, ...student }) => student,
      ),
    });
    expect(ShiftModel.getRequestsForShift).toHaveBeenCalledWith(mockShiftId);
  });
});

describe("createShiftRequest", () => {
  const mockShiftId = "123";
  const mockUserId = "456";
  const mockUser = {
    id: Number(mockUserId),
    username: "testuser",
    email: "",
    phone: "",
    user_role: "student" as const,
    default_hourly_rate: 12,
    date_of_birth: new Date("2000-01-01"),
    first_name: "Test",
    last_name: "User",
    is_active: true,
    must_change_password: false,
    created_at: new Date(),
  };
  const mockShift: Shift = {
    id: Number(mockShiftId),
    scheduled_start_time: "08:00",
    scheduled_end_time: "16:00",
    date: "2023-01-01",
    shift_type: "morning",
  };

  const mockShiftRequest = {
    shift_id: Number(mockShiftId),
    user_id: Number(mockUserId),
    request_created_at: new Date().toISOString(),
  };

  it("should throw error 404 when provided with shiftId of non existing shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(null);

    await expect(createShiftRequest("5", "1")).rejects.toMatchObject({
      statusCode: 404,
      message: "Shift with ID 5 not found",
    });
    expect(ShiftModel.createShiftRequest).not.toHaveBeenCalled();
  });

  it("should throw error 404 when provided with userId of non existing user", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(null);

    await expect(createShiftRequest(mockShiftId, "999")).rejects.toMatchObject({
      statusCode: 404,
      message: "User with ID 999 not found",
    });
    expect(ShiftModel.createShiftRequest).not.toHaveBeenCalled();
  });

  it("should throw error 400 when user has already requested the shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(mockUser);

    vi.mocked(ShiftModel.getShiftRequest).mockResolvedValue(mockShiftRequest);

    await expect(
      createShiftRequest(mockShiftId, mockUserId),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: `User with ID ${mockUserId} has already requested this shift`,
    });
    expect(ShiftModel.createShiftRequest).not.toHaveBeenCalled();
  });

  it("should call ShiftModel.createShiftRequest with the correct parameters when the user and shift exist and the user has not already requested the shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(mockUser);
    vi.mocked(ShiftModel.getShiftRequest).mockResolvedValue(null);

    await createShiftRequest(mockShiftId, mockUserId);

    expect(ShiftModel.createShiftRequest).toHaveBeenCalledWith(
      "123",
      "456",
      12,
    );
  });
});

describe("createAssignmentForShift", () => {
  const mockShiftId = "123";
  const mockUserId = "456";
  const mockShift: Shift = {
    id: Number(mockShiftId),
    scheduled_start_time: "08:00",
    scheduled_end_time: "16:00",
    date: "2023-01-01",
    shift_type: "morning",
  };

  const mockUser = {
    id: Number(mockUserId),
    username: "testuser",
    email: "",
    phone: "",
    user_role: "student" as const,
    default_hourly_rate: 12,
    date_of_birth: new Date("2000-01-01"),
    first_name: "Test",
    last_name: "User",
    is_active: true,
    must_change_password: false,
    created_at: new Date(),
  };
  it("should throw error 404 when provided with shiftId of non existing shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(null);

    await expect(
      createAssignmentForShift(mockShiftId, mockUserId),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: `Shift with ID ${mockShiftId} not found`,
    });
    expect(ShiftModel.createAssignmentForShift).not.toHaveBeenCalled();
  });
  it("should throw error 404 when provided with userId of non existing user", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(null);

    await expect(
      createAssignmentForShift(mockShiftId, mockUserId),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: `User with ID ${mockUserId} not found`,
    });
    expect(ShiftModel.createAssignmentForShift).not.toHaveBeenCalled();
  });

  it("should call ShiftModel.createAssignmentForShift with the correct parameters when the user and shift exist", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(mockUser);

    vi.mocked(ShiftModel.getShiftAssignment).mockResolvedValue(null);

    await createAssignmentForShift(mockShiftId, mockUserId);

    expect(ShiftModel.createAssignmentForShift).toHaveBeenCalledWith(
      "123",
      "456",
      12,
    );
  });

  it("should throw error 400 if provided user is inactive", async () => {
    const inactiveUser = { ...mockUser, is_active: false };

    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(inactiveUser);

    await expect(
      createAssignmentForShift(mockShiftId, mockUserId),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: `User with ID ${mockUserId} is not active and cannot be assigned to shifts`,
    });
    expect(ShiftModel.createAssignmentForShift).not.toHaveBeenCalled();
  });

  it("should throw error 409 if user is already assigned to the shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(UserModel.getUserById).mockResolvedValue(mockUser);
    vi.mocked(ShiftModel.getShiftAssignment).mockResolvedValue({
      shift_id: Number(mockShiftId),
      user_id: Number(mockUserId),
      assignment_created_at: new Date().toISOString(),
    });

    await expect(
      createAssignmentForShift(mockShiftId, mockUserId),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: `User with ID ${mockUserId} is already assigned to shift with ID ${mockShiftId}`,
    });

    expect(ShiftModel.createAssignmentForShift).not.toHaveBeenCalled();
  });
});

describe("modifyShiftAssignedAdmin", () => {
  const mockShiftId = "123";
  const mockUserId = "1";
  const mockShift: Shift = {
    id: 123,
    scheduled_start_time: "08:00",
    scheduled_end_time: "16:00",
    date: "2023-01-01",
    shift_type: "morning",
  };
  const mockAssignment = {
    shift_id: 123,
    user_id: 1,
    actual_start_time: "08:00",
    actual_end_time: "16:00",
    no_show: false,
  };

  function mockShiftAndAssignmentExist() {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(ShiftModel.getShiftAssignment).mockResolvedValue(mockAssignment);
  }

  it("should throw error 400 when shiftId is not provided", async () => {
    await expect(
      modifyShiftAssignedAdmin("", mockUserId, true),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Shift ID is required",
    });
  });

  it("should throw error 400 when userId is not provided", async () => {
    await expect(
      modifyShiftAssignedAdmin(mockShiftId, "", true),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "User ID is required",
    });
  });

  it("should throw error 400 when no_show is not a boolean", async () => {
    await expect(
      modifyShiftAssignedAdmin(mockShiftId, mockUserId, "true" as any),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "no_show must be true or false",
    });
  });

  it("should throw error 404 when the shift does not exist", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(null);

    await expect(
      modifyShiftAssignedAdmin(mockShiftId, mockUserId, true),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: `Shift with ID ${mockShiftId} not found`,
    });
  });

  it("should throw error 404 when the user is not assigned to the shift", async () => {
    vi.mocked(ShiftModel.getShiftById).mockResolvedValue(mockShift);
    vi.mocked(ShiftModel.getShiftAssignment).mockResolvedValue(undefined);

    await expect(
      modifyShiftAssignedAdmin(mockShiftId, mockUserId, true),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: `Shift assignment for shift ID ${mockShiftId} and user ID ${mockUserId} not found`,
    });
    expect(ShiftModel.modifyShiftAssignedAdmin).not.toHaveBeenCalled();
  });

  it("should clear both times when marking a no-show, even if times are provided", async () => {
    mockShiftAndAssignmentExist();

    await modifyShiftAssignedAdmin(
      mockShiftId,
      mockUserId,
      true,
      "09:00",
      "15:00",
    );

    expect(ShiftModel.modifyShiftAssignedAdmin).toHaveBeenCalledWith(
      mockShiftId,
      mockUserId,
      true,
      null,
      null,
    );
  });

  it("should throw error 400 when no_show is false and a time is missing", async () => {
    mockShiftAndAssignmentExist();

    await expect(
      modifyShiftAssignedAdmin(mockShiftId, mockUserId, false, "09:00"),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Both arrivedAt and leftAt must be provided",
    });
    expect(ShiftModel.modifyShiftAssignedAdmin).not.toHaveBeenCalled();
  });

  it("should throw error 400 when a time is not in HH:mm format", async () => {
    mockShiftAndAssignmentExist();

    await expect(
      modifyShiftAssignedAdmin(mockShiftId, mockUserId, false, "9am", "15:00"),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid time format. Please use HH:mm format.",
    });
  });

  it("should throw error 400 when actual_start_time is not earlier than actual_end_time", async () => {
    mockShiftAndAssignmentExist();

    await expect(
      modifyShiftAssignedAdmin(
        mockShiftId,
        mockUserId,
        false,
        "12:00",
        "12:00",
      ),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "actual_start_time must be earlier than actual_end_time",
    });
  });

  it("should throw error 400 when actual_start_time is before the scheduled start", async () => {
    mockShiftAndAssignmentExist();

    await expect(
      modifyShiftAssignedAdmin(
        mockShiftId,
        mockUserId,
        false,
        "07:00",
        "15:00",
      ),
    ).rejects.toMatchObject({
      statusCode: 400,
      message:
        "Actual times must be within the scheduled shift hours (08:00-16:00)",
    });
    expect(ShiftModel.modifyShiftAssignedAdmin).not.toHaveBeenCalled();
  });

  it("should throw error 400 when actual_end_time is after the scheduled end", async () => {
    mockShiftAndAssignmentExist();

    await expect(
      modifyShiftAssignedAdmin(
        mockShiftId,
        mockUserId,
        false,
        "09:00",
        "17:00",
      ),
    ).rejects.toMatchObject({
      statusCode: 400,
      message:
        "Actual times must be within the scheduled shift hours (08:00-16:00)",
    });
  });

  it("should accept times exactly on the scheduled start and end", async () => {
    mockShiftAndAssignmentExist();

    await modifyShiftAssignedAdmin(
      mockShiftId,
      mockUserId,
      false,
      "08:00",
      "16:00",
    );

    expect(ShiftModel.modifyShiftAssignedAdmin).toHaveBeenCalledWith(
      mockShiftId,
      mockUserId,
      false,
      "08:00",
      "16:00",
    );
  });

  it("should save adjusted times and return the updated assignment", async () => {
    mockShiftAndAssignmentExist();
    const updatedAssignment = {
      ...mockAssignment,
      actual_start_time: "09:30",
      actual_end_time: "14:00",
    };
    vi.mocked(ShiftModel.modifyShiftAssignedAdmin).mockResolvedValue(
      updatedAssignment,
    );

    const result = await modifyShiftAssignedAdmin(
      mockShiftId,
      mockUserId,
      false,
      "09:30",
      "14:00",
    );

    expect(ShiftModel.modifyShiftAssignedAdmin).toHaveBeenCalledWith(
      mockShiftId,
      mockUserId,
      false,
      "09:30",
      "14:00",
    );
    expect(result).toEqual(updatedAssignment);
  });
});
