-- Substitui o helper SECURITY DEFINER por checagem inline.
-- O anon só enxerga eventos abertos (policy events_read), então este
-- subquery já rejeita respostas para evento fechado / inexistente.
drop policy "responses_insert_when_open" on public.responses;
drop function if exists public.can_respond(uuid);

create policy "responses_insert_when_open" on public.responses
  for insert to anon, authenticated
  with check (
    exists (select 1 from public.events e where e.id = event_id and e.aberto = true)
  );

revoke execute on function public.handle_new_user() from anon, authenticated, public;
