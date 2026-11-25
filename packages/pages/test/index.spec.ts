import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Worker routes", () => {
	describe("GET /", () => {
		it('redirects to /home/ (unit style)', async () => {
			const request = new Request("http://example.com/");
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe("http://example.com/home/");
		});
	});

	describe("GET /unknown", () => {
		it('returns 404 "Not Found" (unit style)', async () => {
			const request = new Request("http://example.com/unknown");
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);
			expect(response.status).toBe(404);
			expect(await response.text()).toBe("Not Found");
		});

		it('returns 404 "Not Found" (integration style)', async () => {
			const response = await SELF.fetch("http://example.com/unknown");
			expect(response.status).toBe(404);
			expect(await response.text()).toBe("Not Found");
		});
	});
});
