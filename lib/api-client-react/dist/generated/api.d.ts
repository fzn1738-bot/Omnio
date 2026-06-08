import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActivityItem, Agent, AgentUpdate, Alert, AlertDismiss, Appointment, AppointmentInput, AppointmentUpdate, Call, CallStats, DashboardSummary, FollowUp, FollowUpInput, FollowUpUpdate, GetCallStatsParams, GetDashboardSummaryParams, HealthStatus, Lead, LeadInput, LeadUpdate, ListActivityParams, ListAgentsParams, ListAppointmentsParams, ListCallsParams, ListFollowUpsParams, ListLeadsParams } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListCallsUrl: (params?: ListCallsParams) => string;
/**
 * @summary List call logs
 */
export declare const listCalls: (params?: ListCallsParams, options?: RequestInit) => Promise<Call[]>;
export declare const getListCallsQueryKey: (params?: ListCallsParams) => readonly ["/api/calls", ...ListCallsParams[]];
export declare const getListCallsQueryOptions: <TData = Awaited<ReturnType<typeof listCalls>>, TError = ErrorType<unknown>>(params?: ListCallsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCalls>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCalls>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCallsQueryResult = NonNullable<Awaited<ReturnType<typeof listCalls>>>;
export type ListCallsQueryError = ErrorType<unknown>;
/**
 * @summary List call logs
 */
export declare function useListCalls<TData = Awaited<ReturnType<typeof listCalls>>, TError = ErrorType<unknown>>(params?: ListCallsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCalls>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCallUrl: (id: number) => string;
/**
 * @summary Get call detail
 */
export declare const getCall: (id: number, options?: RequestInit) => Promise<Call>;
export declare const getGetCallQueryKey: (id: number) => readonly [`/api/calls/${number}`];
export declare const getGetCallQueryOptions: <TData = Awaited<ReturnType<typeof getCall>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCall>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCall>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCallQueryResult = NonNullable<Awaited<ReturnType<typeof getCall>>>;
export type GetCallQueryError = ErrorType<void>;
/**
 * @summary Get call detail
 */
export declare function useGetCall<TData = Awaited<ReturnType<typeof getCall>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCall>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCallStatsUrl: (params?: GetCallStatsParams) => string;
/**
 * @summary Get call statistics
 */
export declare const getCallStats: (params?: GetCallStatsParams, options?: RequestInit) => Promise<CallStats>;
export declare const getGetCallStatsQueryKey: (params?: GetCallStatsParams) => readonly ["/api/calls/stats", ...GetCallStatsParams[]];
export declare const getGetCallStatsQueryOptions: <TData = Awaited<ReturnType<typeof getCallStats>>, TError = ErrorType<unknown>>(params?: GetCallStatsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCallStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCallStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCallStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getCallStats>>>;
export type GetCallStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get call statistics
 */
export declare function useGetCallStats<TData = Awaited<ReturnType<typeof getCallStats>>, TError = ErrorType<unknown>>(params?: GetCallStatsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCallStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAgentsUrl: (params?: ListAgentsParams) => string;
/**
 * @summary List all AI agents
 */
export declare const listAgents: (params?: ListAgentsParams, options?: RequestInit) => Promise<Agent[]>;
export declare const getListAgentsQueryKey: (params?: ListAgentsParams) => readonly ["/api/agents", ...ListAgentsParams[]];
export declare const getListAgentsQueryOptions: <TData = Awaited<ReturnType<typeof listAgents>>, TError = ErrorType<unknown>>(params?: ListAgentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAgents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAgents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAgentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAgents>>>;
export type ListAgentsQueryError = ErrorType<unknown>;
/**
 * @summary List all AI agents
 */
export declare function useListAgents<TData = Awaited<ReturnType<typeof listAgents>>, TError = ErrorType<unknown>>(params?: ListAgentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAgents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAgentUrl: (id: number) => string;
/**
 * @summary Get agent detail
 */
export declare const getAgent: (id: number, options?: RequestInit) => Promise<Agent>;
export declare const getGetAgentQueryKey: (id: number) => readonly [`/api/agents/${number}`];
export declare const getGetAgentQueryOptions: <TData = Awaited<ReturnType<typeof getAgent>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgent>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAgent>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAgentQueryResult = NonNullable<Awaited<ReturnType<typeof getAgent>>>;
export type GetAgentQueryError = ErrorType<void>;
/**
 * @summary Get agent detail
 */
export declare function useGetAgent<TData = Awaited<ReturnType<typeof getAgent>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgent>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAgentUrl: (id: number) => string;
/**
 * @summary Update agent configuration
 */
export declare const updateAgent: (id: number, agentUpdate: AgentUpdate, options?: RequestInit) => Promise<Agent>;
export declare const getUpdateAgentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAgent>>, TError, {
        id: number;
        data: BodyType<AgentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAgent>>, TError, {
    id: number;
    data: BodyType<AgentUpdate>;
}, TContext>;
export type UpdateAgentMutationResult = NonNullable<Awaited<ReturnType<typeof updateAgent>>>;
export type UpdateAgentMutationBody = BodyType<AgentUpdate>;
export type UpdateAgentMutationError = ErrorType<void>;
/**
* @summary Update agent configuration
*/
export declare const useUpdateAgent: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAgent>>, TError, {
        id: number;
        data: BodyType<AgentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAgent>>, TError, {
    id: number;
    data: BodyType<AgentUpdate>;
}, TContext>;
export declare const getListLeadsUrl: (params?: ListLeadsParams) => string;
/**
 * @summary List sales leads
 */
export declare const listLeads: (params?: ListLeadsParams, options?: RequestInit) => Promise<Lead[]>;
export declare const getListLeadsQueryKey: (params?: ListLeadsParams) => readonly ["/api/leads", ...ListLeadsParams[]];
export declare const getListLeadsQueryOptions: <TData = Awaited<ReturnType<typeof listLeads>>, TError = ErrorType<unknown>>(params?: ListLeadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLeads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLeads>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLeadsQueryResult = NonNullable<Awaited<ReturnType<typeof listLeads>>>;
export type ListLeadsQueryError = ErrorType<unknown>;
/**
 * @summary List sales leads
 */
export declare function useListLeads<TData = Awaited<ReturnType<typeof listLeads>>, TError = ErrorType<unknown>>(params?: ListLeadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLeads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateLeadUrl: () => string;
/**
 * @summary Create a lead
 */
export declare const createLead: (leadInput: LeadInput, options?: RequestInit) => Promise<Lead>;
export declare const getCreateLeadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLead>>, TError, {
        data: BodyType<LeadInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createLead>>, TError, {
    data: BodyType<LeadInput>;
}, TContext>;
export type CreateLeadMutationResult = NonNullable<Awaited<ReturnType<typeof createLead>>>;
export type CreateLeadMutationBody = BodyType<LeadInput>;
export type CreateLeadMutationError = ErrorType<unknown>;
/**
* @summary Create a lead
*/
export declare const useCreateLead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLead>>, TError, {
        data: BodyType<LeadInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createLead>>, TError, {
    data: BodyType<LeadInput>;
}, TContext>;
export declare const getGetLeadUrl: (id: number) => string;
/**
 * @summary Get lead detail
 */
export declare const getLead: (id: number, options?: RequestInit) => Promise<Lead>;
export declare const getGetLeadQueryKey: (id: number) => readonly [`/api/leads/${number}`];
export declare const getGetLeadQueryOptions: <TData = Awaited<ReturnType<typeof getLead>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLead>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLead>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeadQueryResult = NonNullable<Awaited<ReturnType<typeof getLead>>>;
export type GetLeadQueryError = ErrorType<void>;
/**
 * @summary Get lead detail
 */
export declare function useGetLead<TData = Awaited<ReturnType<typeof getLead>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLead>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateLeadUrl: (id: number) => string;
/**
 * @summary Update lead
 */
export declare const updateLead: (id: number, leadUpdate: LeadUpdate, options?: RequestInit) => Promise<Lead>;
export declare const getUpdateLeadMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLead>>, TError, {
        id: number;
        data: BodyType<LeadUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLead>>, TError, {
    id: number;
    data: BodyType<LeadUpdate>;
}, TContext>;
export type UpdateLeadMutationResult = NonNullable<Awaited<ReturnType<typeof updateLead>>>;
export type UpdateLeadMutationBody = BodyType<LeadUpdate>;
export type UpdateLeadMutationError = ErrorType<void>;
/**
* @summary Update lead
*/
export declare const useUpdateLead: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLead>>, TError, {
        id: number;
        data: BodyType<LeadUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLead>>, TError, {
    id: number;
    data: BodyType<LeadUpdate>;
}, TContext>;
export declare const getListAppointmentsUrl: (params?: ListAppointmentsParams) => string;
/**
 * @summary List appointments
 */
export declare const listAppointments: (params?: ListAppointmentsParams, options?: RequestInit) => Promise<Appointment[]>;
export declare const getListAppointmentsQueryKey: (params?: ListAppointmentsParams) => readonly ["/api/appointments", ...ListAppointmentsParams[]];
export declare const getListAppointmentsQueryOptions: <TData = Awaited<ReturnType<typeof listAppointments>>, TError = ErrorType<unknown>>(params?: ListAppointmentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAppointmentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAppointments>>>;
export type ListAppointmentsQueryError = ErrorType<unknown>;
/**
 * @summary List appointments
 */
export declare function useListAppointments<TData = Awaited<ReturnType<typeof listAppointments>>, TError = ErrorType<unknown>>(params?: ListAppointmentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAppointmentUrl: () => string;
/**
 * @summary Create an appointment
 */
export declare const createAppointment: (appointmentInput: AppointmentInput, options?: RequestInit) => Promise<Appointment>;
export declare const getCreateAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
        data: BodyType<AppointmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
    data: BodyType<AppointmentInput>;
}, TContext>;
export type CreateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof createAppointment>>>;
export type CreateAppointmentMutationBody = BodyType<AppointmentInput>;
export type CreateAppointmentMutationError = ErrorType<unknown>;
/**
* @summary Create an appointment
*/
export declare const useCreateAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
        data: BodyType<AppointmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAppointment>>, TError, {
    data: BodyType<AppointmentInput>;
}, TContext>;
export declare const getGetAppointmentUrl: (id: number) => string;
/**
 * @summary Get appointment detail
 */
export declare const getAppointment: (id: number, options?: RequestInit) => Promise<Appointment>;
export declare const getGetAppointmentQueryKey: (id: number) => readonly [`/api/appointments/${number}`];
export declare const getGetAppointmentQueryOptions: <TData = Awaited<ReturnType<typeof getAppointment>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppointment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAppointment>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAppointmentQueryResult = NonNullable<Awaited<ReturnType<typeof getAppointment>>>;
export type GetAppointmentQueryError = ErrorType<void>;
/**
 * @summary Get appointment detail
 */
export declare function useGetAppointment<TData = Awaited<ReturnType<typeof getAppointment>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppointment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAppointmentUrl: (id: number) => string;
/**
 * @summary Update appointment
 */
export declare const updateAppointment: (id: number, appointmentUpdate: AppointmentUpdate, options?: RequestInit) => Promise<Appointment>;
export declare const getUpdateAppointmentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
        id: number;
        data: BodyType<AppointmentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
    id: number;
    data: BodyType<AppointmentUpdate>;
}, TContext>;
export type UpdateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof updateAppointment>>>;
export type UpdateAppointmentMutationBody = BodyType<AppointmentUpdate>;
export type UpdateAppointmentMutationError = ErrorType<void>;
/**
* @summary Update appointment
*/
export declare const useUpdateAppointment: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
        id: number;
        data: BodyType<AppointmentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAppointment>>, TError, {
    id: number;
    data: BodyType<AppointmentUpdate>;
}, TContext>;
export declare const getDeleteAppointmentUrl: (id: number) => string;
/**
 * @summary Delete appointment
 */
export declare const deleteAppointment: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
    id: number;
}, TContext>;
export type DeleteAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAppointment>>>;
export type DeleteAppointmentMutationError = ErrorType<unknown>;
/**
* @summary Delete appointment
*/
export declare const useDeleteAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
    id: number;
}, TContext>;
export declare const getListFollowUpsUrl: (params?: ListFollowUpsParams) => string;
/**
 * @summary List follow-ups
 */
export declare const listFollowUps: (params?: ListFollowUpsParams, options?: RequestInit) => Promise<FollowUp[]>;
export declare const getListFollowUpsQueryKey: (params?: ListFollowUpsParams) => readonly ["/api/follow-ups", ...ListFollowUpsParams[]];
export declare const getListFollowUpsQueryOptions: <TData = Awaited<ReturnType<typeof listFollowUps>>, TError = ErrorType<unknown>>(params?: ListFollowUpsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFollowUps>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFollowUps>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFollowUpsQueryResult = NonNullable<Awaited<ReturnType<typeof listFollowUps>>>;
export type ListFollowUpsQueryError = ErrorType<unknown>;
/**
 * @summary List follow-ups
 */
export declare function useListFollowUps<TData = Awaited<ReturnType<typeof listFollowUps>>, TError = ErrorType<unknown>>(params?: ListFollowUpsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFollowUps>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateFollowUpUrl: () => string;
/**
 * @summary Create a follow-up
 */
export declare const createFollowUp: (followUpInput: FollowUpInput, options?: RequestInit) => Promise<FollowUp>;
export declare const getCreateFollowUpMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFollowUp>>, TError, {
        data: BodyType<FollowUpInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFollowUp>>, TError, {
    data: BodyType<FollowUpInput>;
}, TContext>;
export type CreateFollowUpMutationResult = NonNullable<Awaited<ReturnType<typeof createFollowUp>>>;
export type CreateFollowUpMutationBody = BodyType<FollowUpInput>;
export type CreateFollowUpMutationError = ErrorType<unknown>;
/**
* @summary Create a follow-up
*/
export declare const useCreateFollowUp: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFollowUp>>, TError, {
        data: BodyType<FollowUpInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFollowUp>>, TError, {
    data: BodyType<FollowUpInput>;
}, TContext>;
export declare const getUpdateFollowUpUrl: (id: number) => string;
/**
 * @summary Update follow-up
 */
export declare const updateFollowUp: (id: number, followUpUpdate: FollowUpUpdate, options?: RequestInit) => Promise<FollowUp>;
export declare const getUpdateFollowUpMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFollowUp>>, TError, {
        id: number;
        data: BodyType<FollowUpUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFollowUp>>, TError, {
    id: number;
    data: BodyType<FollowUpUpdate>;
}, TContext>;
export type UpdateFollowUpMutationResult = NonNullable<Awaited<ReturnType<typeof updateFollowUp>>>;
export type UpdateFollowUpMutationBody = BodyType<FollowUpUpdate>;
export type UpdateFollowUpMutationError = ErrorType<void>;
/**
* @summary Update follow-up
*/
export declare const useUpdateFollowUp: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFollowUp>>, TError, {
        id: number;
        data: BodyType<FollowUpUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFollowUp>>, TError, {
    id: number;
    data: BodyType<FollowUpUpdate>;
}, TContext>;
export declare const getGetDashboardSummaryUrl: (params?: GetDashboardSummaryParams) => string;
/**
 * @summary Get dashboard summary metrics
 */
export declare const getDashboardSummary: (params?: GetDashboardSummaryParams, options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: (params?: GetDashboardSummaryParams) => readonly ["/api/dashboard/summary", ...GetDashboardSummaryParams[]];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(params?: GetDashboardSummaryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary metrics
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(params?: GetDashboardSummaryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAlertsUrl: () => string;
/**
 * @summary List active alerts
 */
export declare const listAlerts: (options?: RequestInit) => Promise<Alert[]>;
export declare const getListAlertsQueryKey: () => readonly ["/api/alerts"];
export declare const getListAlertsQueryOptions: <TData = Awaited<ReturnType<typeof listAlerts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAlerts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAlerts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAlertsQueryResult = NonNullable<Awaited<ReturnType<typeof listAlerts>>>;
export type ListAlertsQueryError = ErrorType<unknown>;
/**
 * @summary List active alerts
 */
export declare function useListAlerts<TData = Awaited<ReturnType<typeof listAlerts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAlerts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDismissAlertUrl: (id: number) => string;
/**
 * @summary Dismiss an alert
 */
export declare const dismissAlert: (id: number, alertDismiss?: AlertDismiss, options?: RequestInit) => Promise<Alert>;
export declare const getDismissAlertMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof dismissAlert>>, TError, {
        id: number;
        data?: BodyType<AlertDismiss>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof dismissAlert>>, TError, {
    id: number;
    data?: BodyType<AlertDismiss>;
}, TContext>;
export type DismissAlertMutationResult = NonNullable<Awaited<ReturnType<typeof dismissAlert>>>;
export type DismissAlertMutationBody = BodyType<AlertDismiss> | undefined;
export type DismissAlertMutationError = ErrorType<unknown>;
/**
* @summary Dismiss an alert
*/
export declare const useDismissAlert: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof dismissAlert>>, TError, {
        id: number;
        data?: BodyType<AlertDismiss>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof dismissAlert>>, TError, {
    id: number;
    data?: BodyType<AlertDismiss>;
}, TContext>;
export declare const getListActivityUrl: (params?: ListActivityParams) => string;
/**
 * @summary List activity feed
 */
export declare const listActivity: (params?: ListActivityParams, options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getListActivityQueryKey: (params?: ListActivityParams) => readonly ["/api/activity", ...ListActivityParams[]];
export declare const getListActivityQueryOptions: <TData = Awaited<ReturnType<typeof listActivity>>, TError = ErrorType<unknown>>(params?: ListActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListActivityQueryResult = NonNullable<Awaited<ReturnType<typeof listActivity>>>;
export type ListActivityQueryError = ErrorType<unknown>;
/**
 * @summary List activity feed
 */
export declare function useListActivity<TData = Awaited<ReturnType<typeof listActivity>>, TError = ErrorType<unknown>>(params?: ListActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map