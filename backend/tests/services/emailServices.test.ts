import { describe, it, expect, vi, beforeEach } from "vitest";
import * as EmailService from "../../src/services/emailServices";

// vi.mock is hoisted above the imports, so the fakes it uses must be created with vi.hoisted too.
// `Resend` is a fake class whose instances only have emails.send.
const { send, Resend } = vi.hoisted(() => {
  const send = vi.fn();
  const Resend = vi.fn(function () {
    return { emails: { send } };
  });
  return { send, Resend };
});
vi.mock("resend", () => ({ Resend }));

// `deliver` is private, so it is tested through the exported functions that use it.
describe("deliver (through sendContractReminderEmail)", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("FRONTEND_URL", "http://localhost:5173");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });
  });

  describe("when DEMO_MODE is 'true'", () => {
    beforeEach(() => {
      vi.stubEnv("DEMO_MODE", "true");
    });

    it("does not send the email", async () => {
      await EmailService.sendContractReminderEmail(
        "student@example.com",
        "2026-10",
        "Ana",
      );

      expect(send).not.toHaveBeenCalled();
    });

    it("never even creates the Resend client, so no API key is needed", async () => {
      vi.stubEnv("RESEND_API_KEY", "");

      await EmailService.sendContractReminderEmail(
        "student@example.com",
        "2026-10",
      );

      expect(Resend).not.toHaveBeenCalled();
    });

    it("logs only the recipient and the subject", async () => {
      await EmailService.sendContractReminderEmail(
        "student@example.com",
        "2026-10",
      );

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenCalledWith("Recipient:", "student@example.com");
      expect(logSpy).toHaveBeenCalledWith(
        "Subject:",
        "Reminder: upload your contract for October 2026",
      );
    });

    it("does not send the password reset email either", async () => {
      await EmailService.sendPasswordResetEmail(
        "student@example.com",
        "http://localhost:5173/reset?token=abc",
        "ana",
      );

      expect(send).not.toHaveBeenCalled();
      expect(Resend).not.toHaveBeenCalled();
    });
  });

  describe("when DEMO_MODE is not 'true'", () => {
    // unset, 'false', and anything else must still send: the safe default is to send for real
    it.each([undefined, "false", "", "1", "TRUE"])(
      "sends the email for real (DEMO_MODE = %j)",
      async (value) => {
        vi.stubEnv("DEMO_MODE", value);

        await EmailService.sendContractReminderEmail(
          "student@example.com",
          "2026-10",
          "Ana",
        );

        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith(
          expect.objectContaining({
            to: "student@example.com",
            subject: "Reminder: upload your contract for October 2026",
          }),
        );
      },
    );

    it("throws a 500 AppError when Resend returns an error", async () => {
      vi.stubEnv("DEMO_MODE", "false");
      send.mockResolvedValue({ data: null, error: { message: "boom" } });

      await expect(
        EmailService.sendContractReminderEmail("student@example.com", "2026-10"),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Email failed: boom",
      });
    });
  });
});
