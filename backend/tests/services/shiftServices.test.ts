import { describe, it, expect, vi } from "vitest";
import * as ShiftModel from "../../src/models/shiftModel.js";
import { modifyShift } from "../../src/services/shiftsServices.js";
import { Shift } from "../../src/types/Shift.js";
vi.mock("../../src/models/shiftModel.js");

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
