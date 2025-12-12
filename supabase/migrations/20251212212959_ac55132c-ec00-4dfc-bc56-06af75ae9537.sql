-- Indexes para veiculos (principal tabela, mais consultada)
CREATE INDEX IF NOT EXISTS idx_veiculos_marca ON public.veiculos(marca);
CREATE INDEX IF NOT EXISTS idx_veiculos_modelo ON public.veiculos(modelo);
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON public.veiculos(status);
CREATE INDEX IF NOT EXISTS idx_veiculos_ativo ON public.veiculos(ativo);
CREATE INDEX IF NOT EXISTS idx_veiculos_destaque ON public.veiculos(destaque);
CREATE INDEX IF NOT EXISTS idx_veiculos_preco ON public.veiculos(preco);
CREATE INDEX IF NOT EXISTS idx_veiculos_ano ON public.veiculos(ano);
CREATE INDEX IF NOT EXISTS idx_veiculos_km ON public.veiculos(km);
CREATE INDEX IF NOT EXISTS idx_veiculos_condicao ON public.veiculos(condicao);
CREATE INDEX IF NOT EXISTS idx_veiculos_combustivel ON public.veiculos(combustivel);
CREATE INDEX IF NOT EXISTS idx_veiculos_cambio ON public.veiculos(cambio);
CREATE INDEX IF NOT EXISTS idx_veiculos_carroceria ON public.veiculos(carroceria);
CREATE INDEX IF NOT EXISTS idx_veiculos_slug ON public.veiculos(slug);
CREATE INDEX IF NOT EXISTS idx_veiculos_created_at ON public.veiculos(created_at DESC);

-- Index composto para listagem pública (filtros comuns)
CREATE INDEX IF NOT EXISTS idx_veiculos_listagem ON public.veiculos(ativo, status, destaque, preco);

-- Indexes para leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON public.leads(origem);
CREATE INDEX IF NOT EXISTS idx_leads_responsavel_id ON public.leads(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_leads_veiculo_id ON public.leads(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON public.leads(telefone);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Indexes para lead_interacoes
CREATE INDEX IF NOT EXISTS idx_lead_interacoes_lead_id ON public.lead_interacoes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interacoes_usuario_id ON public.lead_interacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lead_interacoes_created_at ON public.lead_interacoes(created_at DESC);

-- Indexes para lead_tarefas
CREATE INDEX IF NOT EXISTS idx_lead_tarefas_lead_id ON public.lead_tarefas(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tarefas_usuario_id ON public.lead_tarefas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lead_tarefas_concluida ON public.lead_tarefas(concluida);
CREATE INDEX IF NOT EXISTS idx_lead_tarefas_data_limite ON public.lead_tarefas(data_limite);

-- Indexes para avaliacoes_veiculos
CREATE INDEX IF NOT EXISTS idx_avaliacoes_status ON public.avaliacoes_veiculos(status);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_protocolo ON public.avaliacoes_veiculos(protocolo);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_created_at ON public.avaliacoes_veiculos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_marca ON public.avaliacoes_veiculos(marca);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cpf ON public.avaliacoes_veiculos(cpf);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_telefone ON public.avaliacoes_veiculos(telefone);

-- Indexes para modelos (FK)
CREATE INDEX IF NOT EXISTS idx_modelos_marca_id ON public.modelos(marca_id);
CREATE INDEX IF NOT EXISTS idx_modelos_ativo ON public.modelos(ativo);

-- Indexes para marcas
CREATE INDEX IF NOT EXISTS idx_marcas_ativo ON public.marcas(ativo);
CREATE INDEX IF NOT EXISTS idx_marcas_ordem ON public.marcas(ordem);

-- Indexes para veiculo_imagens
CREATE INDEX IF NOT EXISTS idx_veiculo_imagens_veiculo_id ON public.veiculo_imagens(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_veiculo_imagens_principal ON public.veiculo_imagens(principal);
CREATE INDEX IF NOT EXISTS idx_veiculo_imagens_ordem ON public.veiculo_imagens(ordem);

-- Indexes para veiculo_opcionais
CREATE INDEX IF NOT EXISTS idx_veiculo_opcionais_veiculo_id ON public.veiculo_opcionais(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_veiculo_opcionais_opcional_id ON public.veiculo_opcionais(opcional_id);

-- Indexes para banners
CREATE INDEX IF NOT EXISTS idx_banners_ativo ON public.banners(ativo);
CREATE INDEX IF NOT EXISTS idx_banners_ordem ON public.banners(ordem);
CREATE INDEX IF NOT EXISTS idx_banners_data_inicio ON public.banners(data_inicio);
CREATE INDEX IF NOT EXISTS idx_banners_data_fim ON public.banners(data_fim);

-- Indexes para depoimentos
CREATE INDEX IF NOT EXISTS idx_depoimentos_ativo ON public.depoimentos(ativo);
CREATE INDEX IF NOT EXISTS idx_depoimentos_ordem ON public.depoimentos(ordem);

-- Indexes para paginas
CREATE INDEX IF NOT EXISTS idx_paginas_slug ON public.paginas(slug);

-- Indexes para configuracoes
CREATE INDEX IF NOT EXISTS idx_configuracoes_grupo ON public.configuracoes(grupo);
CREATE INDEX IF NOT EXISTS idx_configuracoes_chave ON public.configuracoes(chave);

-- Indexes para integracoes
CREATE INDEX IF NOT EXISTS idx_integracoes_portal ON public.integracoes(portal);
CREATE INDEX IF NOT EXISTS idx_integracoes_ativo ON public.integracoes(ativo);

-- Indexes para integracao_logs
CREATE INDEX IF NOT EXISTS idx_integracao_logs_integracao_id ON public.integracao_logs(integracao_id);
CREATE INDEX IF NOT EXISTS idx_integracao_logs_veiculo_id ON public.integracao_logs(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_integracao_logs_tipo ON public.integracao_logs(tipo);
CREATE INDEX IF NOT EXISTS idx_integracao_logs_created_at ON public.integracao_logs(created_at DESC);

-- Indexes para integracao_veiculos
CREATE INDEX IF NOT EXISTS idx_integracao_veiculos_integracao_id ON public.integracao_veiculos(integracao_id);
CREATE INDEX IF NOT EXISTS idx_integracao_veiculos_veiculo_id ON public.integracao_veiculos(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_integracao_veiculos_status ON public.integracao_veiculos(status);

-- Indexes para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_ativo ON public.profiles(ativo);

-- Indexes para user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Indexes para activity_logs (já existe idx_activity_logs_created_at)
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs(entity_type);

-- Indexes para fipe_cache (já existe idx_fipe_cache_codigo_tipo)
CREATE INDEX IF NOT EXISTS idx_fipe_cache_marca ON public.fipe_cache(marca);
CREATE INDEX IF NOT EXISTS idx_fipe_cache_updated_at ON public.fipe_cache(updated_at DESC);

-- Indexes para cores
CREATE INDEX IF NOT EXISTS idx_cores_ordem ON public.cores(ordem);

-- Indexes para opcionais
CREATE INDEX IF NOT EXISTS idx_opcionais_categoria ON public.opcionais(categoria);
CREATE INDEX IF NOT EXISTS idx_opcionais_ordem ON public.opcionais(ordem);

-- Indexes para status_veiculo
CREATE INDEX IF NOT EXISTS idx_status_veiculo_ativo ON public.status_veiculo(ativo);
CREATE INDEX IF NOT EXISTS idx_status_veiculo_ordem ON public.status_veiculo(ordem);

-- Indexes para simulacoes_financiamento
CREATE INDEX IF NOT EXISTS idx_simulacoes_created_at ON public.simulacoes_financiamento(created_at DESC);

-- Indexes para solicitacoes_credito
CREATE INDEX IF NOT EXISTS idx_solicitacoes_credito_simulacao_id ON public.solicitacoes_credito(simulacao_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_credito_veiculo_id ON public.solicitacoes_credito(veiculo_interesse_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_credito_created_at ON public.solicitacoes_credito(created_at DESC);

-- Indexes para home_config
CREATE INDEX IF NOT EXISTS idx_home_config_secao ON public.home_config(secao);