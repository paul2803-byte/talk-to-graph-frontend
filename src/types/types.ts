/* ── Talk-to-Data API Types ─────────────────────────────────── */

/** Error codes returned by the pipeline */
export type ErrorCode =
    | 'ONTOLOGY_FETCH_FAILED'
    | 'QUERY_GENERATION_FAILED'
    | 'QUERY_REJECTED'
    | 'BUDGET_EXHAUSTED'
    | 'QUERY_EXECUTION_FAILED';

/** A single entry in the conversation history */
export interface ConversationEntry {
    role: 'user' | 'assistant';
    content: string;
}

/** A single row returned by a SPARQL query */
export type QueryResultRow = Record<string, number | string>;

/* ── Request ───────────────────────────────────────────────── */

export interface TalkToDataRequest {
    question: string;
    data: object;
    ontology_url: string;
    sessionId?: string | null;
    epsilon?: number;
    adjusted_query?: string;
    privacy_mode?: boolean;
}

/* ── Responses ─────────────────────────────────────────────── */

interface TalkToDataBaseResponse {
    response: string;
    sessionId: string;
    remainingPrivacyBudget: number;
    sessionEpsilonSpent: number;
    conversationHistory: ConversationEntry[];
}

export interface TalkToDataSuccessResponse extends TalkToDataBaseResponse {
    status: 'success';
    epsilonUsed: number;
    data: {
        query_results: QueryResultRow[];
        sparql_query: string;
    };
}

export interface TalkToDataErrorResponse extends TalkToDataBaseResponse {
    status: 'error';
    errorCode: ErrorCode;
    data: null;
}

/** Discriminated union — check `status` to narrow the type */
export type TalkToDataResponse =
    | TalkToDataSuccessResponse
    | TalkToDataErrorResponse;

export interface PrivacyBudgetResponse {
    remaining_budget: number;
    epsilon_total: number;
    epsilon_base: number;
}

export interface BudgetResetResponse {
    status: 'success';
    message: string;
    remaining_budget: number;
}

/** HTTP-level error (400 / 500) */
export interface HttpErrorResponse {
    error: string;
    status: 'error';
}
