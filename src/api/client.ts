import type {
    TalkToDataRequest,
    TalkToDataResponse,
    PrivacyBudgetResponse,
    BudgetResetResponse,
} from '../types/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/* ── Helpers ───────────────────────────────────────────────── */

async function json<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
            (body as { error?: string }).error ??
            `Request failed with status ${res.status}`,
        );
    }
    return res.json() as Promise<T>;
}

/* ── Public API ────────────────────────────────────────────── */

/** Health check — returns `true` if the server responds */
export async function ping(): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/api/ping`);
        return res.ok;
    } catch {
        return false;
    }
}

/** Send a natural-language question to the backend */
export async function talkToData(
    req: TalkToDataRequest,
): Promise<TalkToDataResponse> {
    const res = await fetch(`${BASE_URL}/api/talk-to-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    return json<TalkToDataResponse>(res);
}

/** Retrieve the current global privacy budget */
export async function getPrivacyBudget(): Promise<PrivacyBudgetResponse> {
    const res = await fetch(`${BASE_URL}/api/privacy-budget`);
    return json<PrivacyBudgetResponse>(res);
}

/** Reset the global privacy budget (demo only) */
export async function resetPrivacyBudget(): Promise<BudgetResetResponse> {
    const res = await fetch(`${BASE_URL}/api/privacy-budget/reset`, {
        method: 'POST',
    });
    return json<BudgetResetResponse>(res);
}
