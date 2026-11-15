import { describe, it, expect, vi } from "vitest";
import * as AppSettingsModel from "../../src/models/appSettingsModel.js";
import { updateAppSettings } from "../../src/services/adminServices.js";
vi.mock("../../src/models/appSettingsModel.js");
vi.mock("../../src/models/adminModel.js");
vi.mock("../../src/models/userModel.js");
vi.mock("../../src/services/emailServices.js", () => ({}));
vi.mock("../../src/config/s3.js", () => ({ s3: {}, S3_BUCKET: "test-bucket" }));

describe("updateAppSettings", () => {
  it("should return 400 when no setting is provided", async () => {
    await expect(updateAppSettings({})).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(AppSettingsModel.updateAppSettings).not.toHaveBeenCalled();
  });

  it.each([0, -5, 100.01, Infinity, NaN, "8" as unknown as number])(
    "should return 400 when the hourly rate is %s",
    async (rate) => {
      await expect(
        updateAppSettings({ new_student_hourly_rate: rate }),
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(AppSettingsModel.updateAppSettings).not.toHaveBeenCalled();
    },
  );

  it.each([-1, 100001, Infinity, NaN, "600" as unknown as number])(
    "should return 400 when the monthly goal is %s",
    async (goal) => {
      await expect(
        updateAppSettings({ new_student_monthly_goal: goal }),
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(AppSettingsModel.updateAppSettings).not.toHaveBeenCalled();
    },
  );

  it("should allow a monthly goal of 0", async () => {
    vi.mocked(AppSettingsModel.updateAppSettings).mockResolvedValue({
      new_student_hourly_rate: 6.56,
      new_student_monthly_goal: 0,
    });

    await updateAppSettings({ new_student_monthly_goal: 0 });

    expect(AppSettingsModel.updateAppSettings).toHaveBeenCalledWith(null, 0);
  });

  it("should only send the provided setting and return the updated settings", async () => {
    const updated = {
      new_student_hourly_rate: 8.5,
      new_student_monthly_goal: 600,
    };
    vi.mocked(AppSettingsModel.updateAppSettings).mockResolvedValue(updated);

    const result = await updateAppSettings({ new_student_hourly_rate: 8.5 });

    expect(AppSettingsModel.updateAppSettings).toHaveBeenCalledWith(8.5, null);
    expect(result).toEqual(updated);
  });
});
