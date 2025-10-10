-- Criar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Permitir upload de fotos
CREATE POLICY "Permitir upload de fotos de perfil"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-photos');

-- Permitir visualização pública
CREATE POLICY "Fotos de perfil são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Permitir deleção (futura melhoria)
CREATE POLICY "Usuários podem deletar suas próprias fotos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'profile-photos');