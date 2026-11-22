import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api';
import { toast } from 'sonner';

export const LEADS_QUERY_KEY = ['leads'];

export function useLeads(params = {}) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, params],
    queryFn: () => leadsApi.getLeads(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useLead(id) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
    initialData: () => {
      // Find the lead in any cached leads query for instantaneous 0ms drawer rendering
      const queries = queryClient.getQueriesData({ queryKey: LEADS_QUERY_KEY });
      for (const [, queryData] of queries) {
        const found = queryData?.data?.find?.((l) => l.id === id);
        if (found) return found;
      }
      return undefined;
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(LEADS_QUERY_KEY)?.dataUpdatedAt;
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => leadsApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead added');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create lead');
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => leadsApi.updateLead(id, data),
    // Optimistic status or field update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: LEADS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: ['lead', id] });

      const previousQueries = queryClient.getQueriesData({ queryKey: LEADS_QUERY_KEY });
      const previousLead = queryClient.getQueryData(['lead', id]);

      // Optimistically update lists
      queryClient.setQueriesData({ queryKey: LEADS_QUERY_KEY }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((lead) =>
            lead.id === id ? { ...lead, ...data, updatedAt: new Date().toISOString() } : lead
          ),
        };
      });

      // Optimistically update single lead
      if (previousLead) {
        queryClient.setQueryData(['lead', id], (old) => ({
          ...old,
          ...data,
          updatedAt: new Date().toISOString(),
        }));
      }

      return { previousQueries, previousLead };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousLead) {
        queryClient.setQueryData(['lead', variables.id], context.previousLead);
      }
      toast.error(err.message || 'Failed to update lead');
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onSuccess: () => {
      toast.success('Lead updated');
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead deleted');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete lead');
    },
  });
}
